import { X } from 'lucide-react';
import { SelectedArtwork } from '@/types/artwork';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelectionPanelProps {
  selectedItems: SelectedArtwork[];
  onDeselect: (id: number) => void;
  onClearAll: () => void;
}

export const SelectionPanel = ({ selectedItems, onDeselect, onClearAll }: SelectionPanelProps) => {
  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Selected Artworks ({selectedItems.length})
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {selectedItems.map((item) => (
            <div 
              key={item.id}
              className="flex items-start justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              <div className="flex-1 min-w-0 mr-2">
                <p className="font-medium text-sm truncate">
                  {item.title}
                </p>
                {item.artist_display && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.artist_display}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeselect(item.id)}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
