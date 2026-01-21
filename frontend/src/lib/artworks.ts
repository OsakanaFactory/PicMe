import api from './api';

export interface Artwork {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string;
  displayOrder: number;
  createdAt: string;
}

export interface ArtworkRequest {
  title: string;
  description: string;
  imageUrl: string;
  tags?: string;
  displayOrder?: number;
}

export interface ArtworkReorderRequest {
  artworkIds: number[];
}

/**
 * 作品一覧取得
 */
export async function getArtworks(): Promise<Artwork[]> {
  const response = await api.get('/api/artworks');
  return response.data.data;
}

/**
 * 作品詳細取得
 */
export async function getArtwork(id: number): Promise<Artwork> {
  const response = await api.get(`/api/artworks/${id}`);
  return response.data.data;
}

/**
 * 作品作成
 */
export async function createArtwork(data: ArtworkRequest): Promise<Artwork> {
  const response = await api.post('/api/artworks', data);
  return response.data.data;
}

/**
 * 作品更新
 */
export async function updateArtwork(id: number, data: ArtworkRequest): Promise<Artwork> {
  const response = await api.put(`/api/artworks/${id}`, data);
  return response.data.data;
}

/**
 * 作品削除
 */
export async function deleteArtwork(id: number): Promise<void> {
  await api.delete(`/api/artworks/${id}`);
}

/**
 * 作品並び替え
 */
export async function reorderArtworks(artworkIds: number[]): Promise<void> {
  await api.put('/api/artworks/reorder', { artworkIds });
}
