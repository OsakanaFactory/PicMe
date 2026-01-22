import api from './api';
import { Profile } from './profile';
import { Artwork } from './artworks';
import { SocialLink } from './social-links';
import { Post } from './posts';

export interface PublicPageData {
  profile: Profile;
  artworks: Artwork[];
  socialLinks: SocialLink[];
  posts: Post[];
}

/**
 * 公開ページデータ取得
 */
export async function getPublicPage(username: string): Promise<PublicPageData> {
  const response = await api.get(`/api/users/${username}`);
  return response.data.data;
}

/**
 * 公開お知らせ一覧取得
 */
export async function getPublicPosts(username: string): Promise<Post[]> {
  const response = await api.get(`/api/users/${username}/posts`);
  return response.data.data;
}

/**
 * 公開お知らせ詳細取得
 */
export async function getPublicPost(username: string, postId: number): Promise<Post> {
  const response = await api.get(`/api/users/${username}/posts/${postId}`);
  return response.data.data;
}
