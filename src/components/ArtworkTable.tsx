import { useState, useEffect } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Artwork, SelectedArtwork } from '@/types/artwork';
import { fetchArtworks } from '@/services/artworkService';
import { SelectionPanel } from './SelectionPanel';
import { Loader2 } from 'lucide-react';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export const ArtworkTable = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedMetadata, setSelectedMetadata] = useState<SelectedArtwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });

  const loadArtworks = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetchArtworks(page, limit);
      const artworksData: Artwork[] = response.data.map((item) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));
      
      setArtworks(artworksData);
      setTotalRecords(response.pagination.total);
      
      // Update selectedArtworks based on selectedIds
      const currentPageSelected = artworksData.filter(artwork => 
        selectedIds.has(artwork.id)
      );
      setSelectedArtworks(currentPageSelected);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtworks(lazyState.page, lazyState.rows);
  }, [lazyState.page, lazyState.rows]);

  const onPage = (event: DataTableStateEvent) => {
    const newPage = (event.first || 0) / (event.rows || 10) + 1;
    setLazyState({
      first: event.first || 0,
      rows: event.rows || 10,
      page: newPage,
    });
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelection = e.value;
    setSelectedArtworks(newSelection);
    
    // Update selectedIds and metadata
    const newSelectedIds = new Set(selectedIds);
    const newMetadata = [...selectedMetadata];
    
    // Get current page artwork IDs
    const currentPageIds = new Set(artworks.map(a => a.id));
    
    // Remove deselected items from current page
    currentPageIds.forEach(id => {
      if (!newSelection.some(item => item.id === id)) {
        newSelectedIds.delete(id);
        const metadataIndex = newMetadata.findIndex(m => m.id === id);
        if (metadataIndex !== -1) {
          newMetadata.splice(metadataIndex, 1);
        }
      }
    });
    
    // Add newly selected items
    newSelection.forEach(item => {
      if (!newSelectedIds.has(item.id)) {
        newSelectedIds.add(item.id);
        newMetadata.push({
          id: item.id,
          title: item.title,
          artist_display: item.artist_display,
        });
      }
    });
    
    setSelectedIds(newSelectedIds);
    setSelectedMetadata(newMetadata);
  };

  const handleDeselect = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
    
    const newMetadata = selectedMetadata.filter(item => item.id !== id);
    setSelectedMetadata(newMetadata);
    
    // Update current page selection
    setSelectedArtworks(selectedArtworks.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
    setSelectedMetadata([]);
    setSelectedArtworks([]);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Art Institute of Chicago Collection
        </h1>
        <p className="text-muted-foreground">
          Browse and select artworks from the collection
        </p>
      </div>

      <SelectionPanel
        selectedItems={selectedMetadata}
        onDeselect={handleDeselect}
        onClearAll={handleClearAll}
      />

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <div className="bg-card rounded-lg shadow-sm border">
        <DataTable
          value={artworks}
          lazy
          paginator
          first={lazyState.first}
          rows={lazyState.rows}
          totalRecords={totalRecords}
          onPage={onPage}
          loading={loading}
          selection={selectedArtworks}
          onSelectionChange={onSelectionChange}
          dataKey="id"
          selectionMode="multiple"
          stripedRows
          showGridlines
          filterDisplay={undefined}
          globalFilterFields={undefined}
          className="artwork-table"
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column 
            field="title" 
            header="Title" 
            style={{ minWidth: '250px' }}
            body={(rowData) => (
              <div className="font-medium">{rowData.title || 'Untitled'}</div>
            )}
          />
          <Column 
            field="place_of_origin" 
            header="Place of Origin" 
            style={{ minWidth: '150px' }}
            body={(rowData) => rowData.place_of_origin || '—'}
          />
          <Column 
            field="artist_display" 
            header="Artist" 
            style={{ minWidth: '200px' }}
            body={(rowData) => rowData.artist_display || '—'}
          />
          <Column 
            field="inscriptions" 
            header="Inscriptions" 
            style={{ minWidth: '200px' }}
            body={(rowData) => (
              <div className="max-w-xs truncate" title={rowData.inscriptions || ''}>
                {rowData.inscriptions || '—'}
              </div>
            )}
          />
          <Column 
            field="date_start" 
            header="Date Start" 
            style={{ minWidth: '120px' }}
            body={(rowData) => rowData.date_start ?? '—'}
          />
          <Column 
            field="date_end" 
            header="Date End" 
            style={{ minWidth: '120px' }}
            body={(rowData) => rowData.date_end ?? '—'}
          />
        </DataTable>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Total records: {totalRecords.toLocaleString()}
      </div>
    </div>
  );
};
