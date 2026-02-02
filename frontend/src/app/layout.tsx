import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Noto_Sans_JP } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PicMe - イラストレーターのためのポートフォリオ",
  description: "簡単に作れる、あなただけのポートフォリオサイト",
  openGraph: {
    title: "PicMe - イラストレーターのためのポートフォリオ",
    description: "簡単に作れる、あなただけのポートフォリオサイト",
    type: "website",
    siteName: "PicMe",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "PicMe - イラストレーターのためのポートフォリオ",
    description: "簡単に作れる、あなただけのポートフォリオサイト",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${outfit.variable} ${notoSansJP.variable} antialiased min-h-screen bg-paper-white text-slate-900 font-sans`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
