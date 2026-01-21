import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
