import api from './api';
import { Profile } from './profile';
import { Artwork } from './artworks';
import { SocialLink } from './social-links';

export interface PublicPageData {
  profile: Profile;
  artworks: Artwork[];
  socialLinks: SocialLink[];
}

/**
 * 公開ページデータ取得
 */
export async function getPublicPage(username: string): Promise<PublicPageData> {
  const response = await api.get(`/api/users/${username}`);
  return response.data.data;
}
