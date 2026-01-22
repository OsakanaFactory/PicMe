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
  LogOut,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'ダッシュボード',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'プロフィール編集',
    href: '/profile',
    icon: User,
  },
  {
    title: '作品管理',
    href: '/artworks',
    icon: ImageIcon,
  },
  {
    title: 'お知らせ',
    href: '/posts',
    icon: FileText,
  },
  {
    title: 'SNSリンク',
    href: '/social-links',
    icon: LinkIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-slate-900">PicMe</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-slate-500 mb-1">公開ページを確認</p>
          {user ? (
            <Link 
              href={`/users/${user.username}`} 
              target="_blank"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              picme.com/{user.username}
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <div className="h-5 w-32 bg-slate-100 animate-pulse rounded"></div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3" 
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </Button>
      </div>
    </div>
  );
}
