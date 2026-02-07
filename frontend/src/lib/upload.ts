import api from './api';
import { Artwork } from './artworks';
import { Profile } from './profile';

/**
 * 作品画像をアップロードして作品を作成
 */
export async function uploadArtwork(
  file: File,
  metadata?: {
    title?: string;
    description?: string;
    categoryId?: number;
    tagIds?: number[];
  },
  onProgress?: (percent: number) => void
): Promise<Artwork> {
  const formData = new FormData();
  formData.append('file', file);
  if (metadata?.title) formData.append('title', metadata.title);
  if (metadata?.description) formData.append('description', metadata.description);
  if (metadata?.categoryId) formData.append('categoryId', metadata.categoryId.toString());
  if (metadata?.tagIds) {
    metadata.tagIds.forEach(id => formData.append('tagIds', id.toString()));
  }

  const response = await api.post('/api/artworks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data.data;
}

/**
 * アバター画像をアップロード
 */
export async function uploadAvatar(
  file: File,
  onProgress?: (percent: number) => void
): Promise<Profile> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data.data;
}

/**
 * ヘッダー画像をアップロード
 */
export async function uploadHeader(
  file: File,
  onProgress?: (percent: number) => void
): Promise<Profile> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/profile/header', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data.data;
}
