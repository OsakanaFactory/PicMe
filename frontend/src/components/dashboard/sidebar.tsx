'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Palette,
  Folder,
  Tag,
  LogOut,
  ExternalLink,
  Crown,
  BarChart3,
  Code,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SquigglyLine } from '@/components/ui/squiggly-line';

const navItems = [
  { title: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { title: 'プロフィール編集', href: '/profile', icon: User },
  { title: '作品管理', href: '/artworks', icon: ImageIcon },
  { title: 'カテゴリー', href: '/categories', icon: Folder, pro: true },
  { title: 'タグ', href: '/tags', icon: Tag, pro: true },
  { title: 'お知らせ', href: '/posts', icon: FileText },
  { title: 'テーマ設定', href: '/themes', icon: Palette },
  { title: 'SNSリンク', href: '/social-links', icon: LinkIcon },
  { title: 'アクセス解析', href: '/analytics', icon: BarChart3, pro: true },
  { title: 'カスタムCSS', href: '/custom-css', icon: Code, pro: true },
  { title: 'プラン・課金', href: '/upgrade', icon: Crown },
];

interface SidebarProps {
  variant?: 'desktop' | 'mobile';
  onClose?: () => void;
}

export function Sidebar({ variant = 'desktop', onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleNavClick = () => {
    if (variant === 'mobile' && onClose) {
      onClose();
    }
  };

  return (
    <div className={`flex h-full flex-col bg-white ${variant === 'desktop' ? 'w-64 border-r border-slate-200' : 'w-full'}`}>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-1" onClick={handleNavClick}>
          <span className="font-outfit font-black text-xl tracking-tight text-slate-900">PicMe</span>
          <SquigglyLine className="w-12 h-3 text-brand-green -ml-1" />
        </Link>
        {variant === 'mobile' && onClose && (
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-slate-900 text-slate-50'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {item.pro && !isActive && (
                    <span className="ml-auto text-[10px] text-slate-400 font-normal">PRO</span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4 space-y-4">
        {user && (
          <Link
            href={`/${user.username}`}
            target="_blank"
            onClick={handleNavClick}
            className="block"
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="truncate">pic-me.net/{user.username}</span>
            </div>
          </Link>
        )}

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={() => {
            handleNavClick();
            logout();
          }}
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </Button>
      </div>
    </div>
  );
}
