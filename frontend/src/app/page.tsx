import { Metadata } from 'next';
import LandingClient from './_landing-client';

export const metadata: Metadata = {
  title: 'PicMe（ぴくみー） - イラストレーター・クリエイター向けポートフォリオサイト',
  description:
    'PicMeは、イラストレーター・デザイナー・写真家のためのポートフォリオ作成サービスです。作品ギャラリー、テーマカスタマイズ、SNSリンク集約を1分で。無料プランあり。',
  openGraph: {
    title: 'PicMe（ぴくみー） - クリエイター向けポートフォリオサイト',
    description:
      'イラスト・デザイン・写真。あなたの作品を、1分でポートフォリオに。無料ではじめられます。',
    type: 'website',
    siteName: 'PicMe',
    locale: 'ja_JP',
    url: 'https://pic-me.net',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PicMe - クリエイター向けポートフォリオサイト',
    description:
      'イラスト・デザイン・写真。あなたの作品を、1分でポートフォリオに。',
  },
  alternates: {
    canonical: 'https://pic-me.net',
  },
};

export default function LandingPage() {
  return (
    <>
      {/*
        SEO用の静的コンテンツ。
        サーバーサイドHTMLに含まれるため、Googlebotが確実にテキストを読める。
        クライアントコンポーネント (LandingClient) が同じ画面を
        アニメーション付きで描画するため、ユーザーにはこの部分は見えない。
        aria-hidden + 視覚的非表示だが、HTMLソース上にはテキストが存在する。
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        <h1>PicMe（ぴくみー） - クリエイター向けポートフォリオサイト</h1>
        <h2>つくる人の、見せる場所。</h2>
        <p>
          イラスト・デザイン・写真。あなたの作品を、1分でポートフォリオに。
          クリエイターのためのポートフォリオ作成サービス PicMe なら、
          簡単にあなただけのポートフォリオサイトを作成できます。
        </p>

        <h2>PicMeでできること</h2>
        <h3>作品をギャラリーで魅せる</h3>
        <p>Masonry/グリッドで作品を美しく配置。カテゴリー・タグで絞り込み。</p>
        <h3>テーマで自分らしく</h3>
        <p>LIGHT・DARK・WARM・COOL。カラーもフォントもカスタマイズ。</p>
        <h3>SNSリンクをひとまとめ</h3>
        <p>Twitter、Instagram、pixiv…全SNSを1ページに。</p>

        <h2>機能一覧</h2>
        <ul>
          <li>お知らせ投稿</li>
          <li>お問い合わせフォーム</li>
          <li>アクセス解析</li>
          <li>カスタムCSS</li>
          <li>Markdown対応</li>
          <li>ドラッグ&ドロップ並び替え</li>
        </ul>

        <h2>はじめかた</h2>
        <ol>
          <li>アカウント登録 — メールアドレスだけでOK</li>
          <li>作品を追加 — 画像をアップロードするだけ</li>
          <li>公開！ — あなた専用URLですぐ公開</li>
        </ol>

        <h2>料金プラン</h2>
        <ul>
          <li>Free — ¥0/月（作品10点、SNSリンク5つ）</li>
          <li>Starter — ¥500/月（作品50点、SNSリンク20）</li>
          <li>Pro — ¥1,200/月（作品無制限、カテゴリー・タグ、アクセス解析、カスタムCSS）</li>
          <li>Studio — ¥2,500/月（全機能、優先サポート、500行CSS）</li>
        </ul>

        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <nav>
          {/* eslint-disable @next/next/no-html-link-for-pages */}
          <a href="/login">ログイン</a>
          <a href="/signup">新規登録</a>
          <a href="/terms">利用規約</a>
          <a href="/privacy">プライバシーポリシー</a>
          {/* eslint-enable @next/next/no-html-link-for-pages */}
        </nav>
      </div>

      {/* アニメーション付きLP（クライアントコンポーネント） */}
      <LandingClient />
    </>
  );
}
