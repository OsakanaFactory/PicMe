import { ImageResponse } from 'next/og';
import { loadOutfitFont, loadNotoSansJPFont } from '@/lib/og-fonts';

export const runtime = 'edge';
export const alt = 'PicMe - イラストレーターのためのポートフォリオ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [outfitData, notoData] = await Promise.all([
    loadOutfitFont(),
    loadNotoSansJPFont(),
  ]);

  return new ImageResponse(
    (
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
          <div
            style={{
              fontSize: 120,
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            PicMe
          </div>

          {/* 区切り線 */}
          <div
            style={{
              width: 120,
              height: 6,
              backgroundColor: '#1A1A1A',
              borderRadius: 3,
              display: 'flex',
              marginTop: 8,
              marginBottom: 16,
            }}
          />

          <div
            style={{
              fontSize: 36,
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>イラストレーターのための</span>
            <span>ポートフォリオサイト</span>
          </div>
        </div>

        {/* カラーブロック3色 */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 48,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#FF8A65',
              borderRadius: 12,
              display: 'flex',
            }}
          />
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              display: 'flex',
            }}
          />
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              border: '3px solid #1A1A1A',
              display: 'flex',
            }}
          />
        </div>

        {/* URL */}
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
