'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Image as ImageIcon, Link as LinkIcon, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-slate-500">
          ようこそ、{user?.username}さん。ポートフォリオの管理状況を確認しましょう。
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">作品を追加</CardTitle>
            <ImageIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-500 mb-4">
              新しいイラストや作品をギャラリーに追加します
            </div>
            <Link href="/artworks">
              <Button size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> 追加する
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SNSリンク管理</CardTitle>
            <LinkIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
             <div className="text-xs text-slate-500 mb-4">
              X (Twitter) や Instagram などのリンクを編集
            </div>
            <Link href="/social-links">
              <Button size="sm" variant="outline" className="w-full">
                編集する
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">プロフィール編集</CardTitle>
            <UserIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
             <div className="text-xs text-slate-500 mb-4">
              自己紹介文やアイコン画像を変更します
            </div>
            <Link href="/profile">
              <Button size="sm" variant="outline" className="w-full">
                編集する
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-slate-50 hover:bg-slate-800 transition-colors border-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">公開ページを確認</CardTitle>
            <Eye className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
             <div className="text-xs text-slate-400 mb-4">
              あなたのポートフォリオがどう見えるか確認します
            </div>
            <Link href={`/users/${user?.username}`} target="_blank">
              <Button size="sm" variant="secondary" className="w-full">
                ページを見る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最近のアクセス（デモ）</CardTitle>
            <CardDescription>
              過去30日間のページビュー数
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-md border border-dashed border-slate-200">
              グラフが表示されます (Coming Soon)
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>最近の作品</CardTitle>
            <CardDescription>
              最近アップロードした作品
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-slate-300" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">まだ作品がありません</p>
                  <p className="text-xs text-slate-500">最初の作品を投稿しましょう</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
