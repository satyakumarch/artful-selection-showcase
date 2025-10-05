import { ApiResponse } from '@/types/artwork';

const API_BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number, limit: number = 10): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch artworks');
  }
  
  const data = await response.json();
  return data;
};
