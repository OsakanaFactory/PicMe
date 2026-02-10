'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Sidebar } from '@/components/dashboard/sidebar';
import { EmailVerificationBanner } from '@/components/dashboard/email-verification-banner';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // ページ遷移時にモバイルメニュー自動クローズ
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white gap-4">
        <div className="flex items-center gap-1">
          <span className="font-outfit font-black text-2xl tracking-tight">PicMe</span>
          <SquigglyLine className="w-14 h-3 text-brand-green -ml-1" />
        </div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SubscriptionProvider>
      <div className="flex h-screen bg-white relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar variant="desktop" />
        </div>

        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 md:hidden">
          <div className="flex h-14 items-center justify-between px-4 bg-white/90 backdrop-blur-md border-b border-slate-200">
            <div className="flex items-center gap-1">
              <span className="font-outfit font-black text-lg tracking-tight">PicMe</span>
              <SquigglyLine className="w-10 h-2.5 text-brand-green -ml-1" />
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/30 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Sidebar variant="mobile" onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <FloatingShapes variant="dashboard" />
          <main className="flex-1 overflow-y-auto pt-14 md:pt-0 p-4 md:p-8 relative z-10">
            <div className="mx-auto max-w-5xl">
              <EmailVerificationBanner />
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionProvider>
  );
}
