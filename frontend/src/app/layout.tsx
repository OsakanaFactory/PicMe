import { Outfit, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

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
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${outfit.variable} ${notoSansJP.variable} antialiased min-h-screen bg-paper-white text-slate-900 font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
