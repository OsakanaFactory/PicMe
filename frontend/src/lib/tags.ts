import apiClient from './api';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

/**
 * タグ一覧を取得
 */
export async function getTags(): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>('/api/tags');
  return response.data;
}

/**
 * タグを作成
 */
export async function createTag(name: string): Promise<Tag> {
  const response = await apiClient.post<Tag>('/api/tags', { name });
  return response.data;
}

/**
 * タグを削除
 */
export async function deleteTag(id: number): Promise<void> {
  await apiClient.delete(`/api/tags/${id}`);
}
