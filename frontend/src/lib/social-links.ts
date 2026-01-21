import api from './api';

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  displayOrder: number;
  visible: boolean;
}

export interface SocialLinkRequest {
  platform: string;
  url: string;
  visible?: boolean;
}

export interface SocialLinkReorderRequest {
  linkIds: number[];
}

/**
 * SNSリンク一覧取得
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const response = await api.get('/api/social-links');
  return response.data.data;
}

/**
 * SNSリンク作成
 */
export async function createSocialLink(data: SocialLinkRequest): Promise<SocialLink> {
  const response = await api.post('/api/social-links', data);
  return response.data.data;
}

/**
 * SNSリンク更新
 */
export async function updateSocialLink(id: number, data: SocialLinkRequest): Promise<SocialLink> {
  const response = await api.put(`/api/social-links/${id}`, data);
  return response.data.data;
}

/**
 * SNSリンク削除
 */
export async function deleteSocialLink(id: number): Promise<void> {
  await api.delete(`/api/social-links/${id}`);
}

/**
 * SNSリンク並び替え
 */
export async function reorderSocialLinks(linkIds: number[]): Promise<void> {
  await api.put('/api/social-links/reorder', { linkIds });
}
