'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { dashStaggerContainer, dashStaggerItem } from '@/lib/motion';
import { Plus, Image as ImageIcon, Link as LinkIcon, Eye, LayoutDashboard, User } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const accent = user?.colorAccent;

  const quickActions = [
    {
      title: '作品を追加',
      desc: '新しいイラストや作品をギャラリーに追加します',
      icon: ImageIcon,
      href: '/artworks',
      buttonLabel: '追加する',
      buttonIcon: Plus,
    },
    {
      title: 'SNSリンク管理',
      desc: 'X (Twitter) や Instagram などのリンクを編集',
      icon: LinkIcon,
      href: '/social-links',
      buttonLabel: '編集する',
      buttonVariant: 'outline' as const,
    },
    {
      title: 'プロフィール編集',
      desc: '自己紹介文やアイコン画像を変更します',
      icon: User,
      href: '/profile',
      buttonLabel: '編集する',
      buttonVariant: 'outline' as const,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="ダッシュボード"
        description={`ようこそ、${user?.username}さん。ポートフォリオの管理状況を確認しましょう。`}
        accentColor={accent}
      />

      {/* Quick Actions */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={dashStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        {quickActions.map((action) => (
          <motion.div key={action.title} variants={dashStaggerItem}>
            <div className="bg-white border border-slate-200 rounded-lg p-5 h-full flex flex-col transition-shadow hover:shadow-sm">
              {accent && <div className="w-full h-1 rounded-full mb-4" style={{ backgroundColor: accent }} />}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-outfit font-bold text-sm">{action.title}</h3>
                <action.icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-4 flex-1">{action.desc}</p>
              <Link href={action.href}>
                <Button size="sm" variant={action.buttonVariant || 'primary'} className="w-full">
                  {action.buttonIcon && <action.buttonIcon className="mr-2 h-4 w-4" />}
                  {action.buttonLabel}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}

        {/* 公開ページカード */}
        <motion.div variants={dashStaggerItem}>
          <div className="bg-slate-900 text-white border border-slate-800 rounded-lg p-5 h-full flex flex-col transition-shadow hover:shadow-md">
            {accent && <div className="w-full h-1 rounded-full mb-4" style={{ backgroundColor: accent }} />}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-outfit font-bold text-sm">公開ページを確認</h3>
              <Eye className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 mb-4 flex-1">
              あなたのポートフォリオがどう見えるか確認します
            </p>
            <Link href={`/${user?.username}`} target="_blank">
              <Button size="sm" variant="secondary" className="w-full">
                ページを見る
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        variants={dashStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="col-span-4 bg-white border border-slate-200 rounded-lg overflow-hidden"
          variants={dashStaggerItem}
        >
          <div className="p-6">
            <h3 className="font-outfit font-bold text-lg mb-1">最近のアクセス</h3>
            <p className="text-sm text-slate-500 mb-4">過去30日間のページビュー数</p>
            <div className="h-[200px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-md border border-dashed border-slate-200">
              グラフが表示されます (Coming Soon)
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-span-3 bg-white border border-slate-200 rounded-lg overflow-hidden"
          variants={dashStaggerItem}
        >
          <div className="p-6">
            <h3 className="font-outfit font-bold text-lg mb-1">最近の作品</h3>
            <p className="text-sm text-slate-500 mb-4">最近アップロードした作品</p>
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
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
