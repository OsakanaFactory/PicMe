import api from './api';

export interface Profile {
  userId: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  headerUrl: string;
  theme: string;
  colorPrimary?: string;
  colorAccent?: string;
  fontFamily?: string;
  layout: string;
  customCss?: string;
  contactFormEnabled?: boolean;
  planType?: string;
}

export interface ProfileUpdateRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  headerUrl?: string;
  theme?: string;
  colorPrimary?: string;
  colorAccent?: string;
  fontFamily?: string;
  layout?: string;
}

/**
 * プロフィール取得
 */
export async function getProfile(): Promise<Profile> {
  const response = await api.get('/api/profile');
  return response.data.data;
}

/**
 * プロフィール更新
 */
export async function updateProfile(data: ProfileUpdateRequest): Promise<Profile> {
  const response = await api.put('/api/profile', data);
  return response.data.data;
}

/**
 * 公開プロフィール取得
 */
export async function getPublicProfile(username: string): Promise<Profile> {
  const response = await api.get(`/api/users/${username}/profile`);
  return response.data.data;
}

/**
 * カスタムCSS更新
 */
export async function updateCustomCss(customCss: string): Promise<Profile> {
  const response = await api.put('/api/profile/custom-css', { customCss });
  return response.data.data;
}
