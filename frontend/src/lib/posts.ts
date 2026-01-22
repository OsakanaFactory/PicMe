import api from './api';

export interface Post {
  id: number;
  title: string;
  content: string;
  contentHtml?: string;
  thumbnailUrl?: string;
  visible: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
  thumbnailUrl?: string;
  visible?: boolean;
}

/**
 * 投稿一覧取得
 */
export async function getPosts(): Promise<Post[]> {
  const response = await api.get('/api/posts');
  return response.data.data;
}

/**
 * 投稿詳細取得
 */
export async function getPost(id: number): Promise<Post> {
  const response = await api.get(`/api/posts/${id}`);
  return response.data.data;
}

/**
 * 投稿作成
 */
export async function createPost(data: PostRequest): Promise<Post> {
  const response = await api.post('/api/posts', data);
  return response.data.data;
}

/**
 * 投稿更新
 */
export async function updatePost(id: number, data: PostRequest): Promise<Post> {
  const response = await api.put(`/api/posts/${id}`, data);
  return response.data.data;
}

/**
 * 投稿削除
 */
export async function deletePost(id: number): Promise<void> {
  await api.delete(`/api/posts/${id}`);
}

/**
 * 投稿の公開状態を切り替え
 */
export async function togglePostVisibility(id: number): Promise<Post> {
  const response = await api.put(`/api/posts/${id}/toggle-visibility`);
  return response.data.data;
}
