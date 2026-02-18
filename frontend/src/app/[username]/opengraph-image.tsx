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
  planType: string;
  colorAccent: string | null;
}

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
      planType: p.planType || 'FREE',
      colorAccent: p.colorAccent || null,
    };
  } catch {
    return null;
  }
}

// アバターあり: 全面表示 + 左上にDisplayName
function AvatarFullOgImage({
  profile,
  isPro,
}: {
  profile: ProfileData;
  isPro: boolean;
}) {
  const accent = profile.colorAccent || '#FF8A65';
  const badgeLabel = profile.planType === 'STUDIO' ? 'STUDIO' : 'PRO';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
      }}
    >
      {/* アバター全面背景 */}
      <img
        src={profile.avatarUrl!}
        alt=""
        width={1200}
        height={630}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* DisplayName 左上 */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 48,
          fontSize: 64,
          fontFamily: 'Outfit',
          fontWeight: 700,
          color: '#FFFFFF',
          textShadow: '2px 2px 12px rgba(0,0,0,0.8), 0px 0px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        {profile.displayName}
      </div>

      {/* PRO/STUDIO バッジ (右上) */}
      {isPro && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: accent,
            color: '#FFFFFF',
            fontSize: 22,
            fontFamily: 'Outfit',
            fontWeight: 700,
            padding: '10px 24px',
            borderRadius: 14,
            boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
            textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          ★ {badgeLabel}
        </div>
      )}

      {/* ブランド (右下) */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 48,
          fontSize: 24,
          fontFamily: 'Outfit',
          fontWeight: 700,
          color: '#FFFFFF',
          opacity: 0.7,
          textShadow: '1px 1px 8px rgba(0,0,0,0.8)',
          display: 'flex',
        }}
      >
        {isPro ? 'pic-me.net' : 'PicMe'}
      </div>
    </div>
  );
}

// アバターなし: LP風デザイン + DisplayName
function NoAvatarOgImage({
  profile,
  isPro,
}: {
  profile: ProfileData;
  isPro: boolean;
}) {
  const accent = profile.colorAccent || '#FF8A65';
  const badgeLabel = profile.planType === 'STUDIO' ? 'STUDIO' : 'PRO';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9F99D',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* コーラル大円（左上はみ出し） */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -100,
          width: 380,
          height: 380,
          borderRadius: '50%',
          backgroundColor: '#FF8A65',
          display: 'flex',
        }}
      />

      {/* 黒小矩形（右下） */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 180,
          width: 48,
          height: 48,
          backgroundColor: '#1A1A1A',
          borderRadius: 8,
          display: 'flex',
        }}
      />

      {/* ライム中円（右下） */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 80,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: '#A3E635',
          display: 'flex',
        }}
      />

      {/* メインコンテンツ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* DisplayName */}
        <div
          style={{
            fontSize: 72,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textAlign: 'center',
            maxWidth: 1000,
            display: 'flex',
          }}
        >
          {profile.displayName}
        </div>

        {/* 区切り線 */}
        <div
          style={{
            width: 120,
            height: 6,
            backgroundColor: '#1A1A1A',
            borderRadius: 3,
            display: 'flex',
            marginTop: 12,
            marginBottom: 4,
          }}
        />
      </div>

      {/* カラーブロック3色 */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 40,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#1A1A1A',
            borderRadius: 10,
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#FF8A65',
            borderRadius: 10,
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#A3E635',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      </div>

      {/* PRO/STUDIO バッジ (右上) */}
      {isPro && (
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: accent,
            color: '#FFFFFF',
            fontSize: 20,
            fontFamily: 'Outfit',
            fontWeight: 700,
            padding: '8px 20px',
            borderRadius: 12,
            boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
          }}
        >
          ★ {badgeLabel}
        </div>
      )}

      {/* pic-me.net */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: 48,
          fontSize: 24,
          fontFamily: 'Outfit',
          fontWeight: 700,
          color: '#1A1A1A',
          opacity: 0.6,
          display: 'flex',
        }}
      >
        pic-me.net
      </div>
    </div>
  );
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
  const hasAvatar = !!profile.avatarUrl;

  const content = hasAvatar ? (
    <AvatarFullOgImage profile={profile} isPro={isPro} />
  ) : (
    <NoAvatarOgImage profile={profile} isPro={isPro} />
  );

  return new ImageResponse(content, {
    ...size,
    fonts: [
      { name: 'Outfit', data: outfitData, style: 'normal', weight: 700 },
      { name: 'Noto Sans JP', data: notoData, style: 'normal', weight: 700 },
    ],
  });
}
