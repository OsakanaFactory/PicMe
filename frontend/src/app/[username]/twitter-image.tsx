import { ImageResponse } from 'next/og';
import { loadOutfitFont, loadNotoSansJPFont } from '@/lib/og-fonts';

export const runtime = 'edge';
export const alt = 'ポートフォリオ | PicMe';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || API_BASE_URL;

interface ProfileData {
  displayName: string;
  avatarUrl: string | null;
  headerUrl: string | null;
  planType: string;
  theme: string;
  colorAccent: string | null;
}

const THEME_BG: Record<string, string> = {
  LIGHT: '#FFFFFF',
  DARK: '#1A1A1A',
  WARM: '#FFFBEB',
  COOL: '#F0F9FF',
};

async function fetchProfile(username: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${INTERNAL_API_URL}/api/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const p = json.data.profile;
    return {
      displayName: p.displayName || username,
      avatarUrl: p.avatarUrl || null,
      headerUrl: p.headerUrl || null,
      planType: p.planType || 'FREE',
      theme: p.theme || 'LIGHT',
      colorAccent: p.colorAccent || null,
    };
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [outfitData, notoData, profile] = await Promise.all([
    loadOutfitFont(),
    loadNotoSansJPFont(),
    fetchProfile(username),
  ]);

  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D9F99D',
            fontSize: 64,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#1A1A1A',
          }}
        >
          PicMe
        </div>
      ),
      {
        ...size,
        fonts: [
          { name: 'Outfit', data: outfitData, style: 'normal', weight: 700 },
        ],
      },
    );
  }

  const isPro = profile.planType === 'PRO' || profile.planType === 'STUDIO';
  const hasHeader = !!profile.headerUrl;
  const avatarUrl = profile.avatarUrl || null;
  const accent = profile.colorAccent || '#FF8A65';
  const badgeLabel = profile.planType === 'STUDIO' ? 'STUDIO' : 'PRO';
  const bgColor = THEME_BG[profile.theme] || '#FFFFFF';
  const textColor = profile.theme === 'DARK' ? '#FFFFFF' : '#1A1A1A';

  // FREE/STARTER: シンプル版
  if (!isPro) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            position: 'relative',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              width={320}
              height={320}
              style={{ borderRadius: 20, border: '2px solid #E5E7EB', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 320,
                height: 320,
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #D9F99D, #FF8A65)',
                border: '2px solid #E5E7EB',
              }}
            >
              <span style={{ fontSize: 160, fontFamily: 'Outfit', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>
                {profile.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div style={{ fontSize: 48, fontFamily: 'Outfit', fontWeight: 700, color: '#1A1A1A', marginTop: 28, display: 'flex' }}>
            {profile.displayName}
          </div>
          <div style={{ position: 'absolute', bottom: 28, right: 40, fontSize: 20, fontFamily: 'Outfit', fontWeight: 700, color: '#9CA3AF', display: 'flex' }}>
            Powered by PicMe
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          { name: 'Outfit', data: outfitData, style: 'normal', weight: 700 },
          { name: 'Noto Sans JP', data: notoData, style: 'normal', weight: 700 },
        ],
      },
    );
  }

  // PRO/STUDIO: ヘッダー画像あり
  if (hasHeader) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <img src={profile.headerUrl!} alt="" width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" width={400} height={400} style={{ borderRadius: 20, border: '6px solid white', boxShadow: '8px 8px 0px rgba(0,0,0,0.3)', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 400, height: 400, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #D9F99D, #FF8A65)', border: '6px solid white', boxShadow: '8px 8px 0px rgba(0,0,0,0.3)' }}>
                <span style={{ fontSize: 160, fontFamily: 'Outfit', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{profile.displayName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div style={{ fontSize: 56, fontFamily: 'Outfit', fontWeight: 700, color: '#FFFFFF', marginTop: 24, textShadow: '2px 2px 8px rgba(0,0,0,0.5)', display: 'flex' }}>
              {profile.displayName}
            </div>
          </div>
          <div style={{ position: 'absolute', top: 32, right: 40, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: accent, color: '#FFFFFF', fontSize: 20, fontFamily: 'Outfit', fontWeight: 700, padding: '8px 20px', borderRadius: 12, boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
            ★ {badgeLabel}
          </div>
          <div style={{ position: 'absolute', bottom: 28, right: 40, fontSize: 20, fontFamily: 'Outfit', fontWeight: 700, color: 'rgba(255,255,255,0.7)', display: 'flex' }}>
            pic-me.net
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          { name: 'Outfit', data: outfitData, style: 'normal', weight: 700 },
          { name: 'Noto Sans JP', data: notoData, style: 'normal', weight: 700 },
        ],
      },
    );
  }

  // PRO/STUDIO: ヘッダー画像なし
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: bgColor, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: -60, width: 300, height: 300, borderRadius: '50%', backgroundColor: accent, opacity: 0.3, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 80, right: 60, width: 60, height: 60, backgroundColor: accent, borderRadius: 12, opacity: 0.4, display: 'flex' }} />
        {avatarUrl ? (
          <img src={avatarUrl} alt="" width={400} height={400} style={{ borderRadius: 20, border: '6px solid white', boxShadow: '8px 8px 0px rgba(0,0,0,0.3)', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 400, height: 400, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #D9F99D, #FF8A65)', border: '6px solid white', boxShadow: '8px 8px 0px rgba(0,0,0,0.3)' }}>
            <span style={{ fontSize: 160, fontFamily: 'Outfit', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{profile.displayName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div style={{ fontSize: 56, fontFamily: 'Outfit', fontWeight: 700, color: textColor, marginTop: 24, display: 'flex' }}>
          {profile.displayName}
        </div>
        <div style={{ position: 'absolute', top: 32, right: 40, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: accent, color: '#FFFFFF', fontSize: 20, fontFamily: 'Outfit', fontWeight: 700, padding: '8px 20px', borderRadius: 12, boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
          ★ {badgeLabel}
        </div>
        <div style={{ position: 'absolute', bottom: 28, right: 40, fontSize: 20, fontFamily: 'Outfit', fontWeight: 700, color: textColor, opacity: 0.4, display: 'flex' }}>
          pic-me.net
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Outfit', data: outfitData, style: 'normal', weight: 700 },
        { name: 'Noto Sans JP', data: notoData, style: 'normal', weight: 700 },
      ],
    },
  );
}
