import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PicMe - イラストレーターのためのポートフォリオ",
  description: "簡単に作れる、あなただけのポートフォリオサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
