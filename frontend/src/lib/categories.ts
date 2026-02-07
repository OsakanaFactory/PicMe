import apiClient from './api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  createdAt: string;
}

export interface CategoryRequest {
  name: string;
  displayOrder?: number;
}

/**
 * カテゴリー一覧を取得
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/api/categories');
  return response.data;
}

/**
 * カテゴリーを取得
 */
export async function getCategory(id: number): Promise<Category> {
  const response = await apiClient.get<Category>(`/api/categories/${id}`);
  return response.data;
}

/**
 * カテゴリーを作成
 */
export async function createCategory(data: CategoryRequest): Promise<Category> {
  const response = await apiClient.post<Category>('/api/categories', data);
  return response.data;
}

/**
 * カテゴリーを更新
 */
export async function updateCategory(id: number, data: CategoryRequest): Promise<Category> {
  const response = await apiClient.put<Category>(`/api/categories/${id}`, data);
  return response.data;
}

/**
 * カテゴリーを削除
 */
export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/api/categories/${id}`);
}
