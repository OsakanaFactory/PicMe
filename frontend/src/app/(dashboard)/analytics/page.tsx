'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalyticsSummary, getAnalyticsTimeline, AnalyticsSummary, TimelineEntry } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { dashStaggerContainer, dashStaggerItem } from '@/lib/motion';
import { BarChart3, Eye, TrendingUp, Globe, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

const STAT_CONFIG = [
  { key: 'totalViews', label: '総PV', icon: Eye, accent: 'bg-blue-500' },
  { key: 'todayViews', label: '今日', icon: TrendingUp, accent: 'bg-green-500' },
  { key: 'weekViews', label: '今週', icon: BarChart3, accent: 'bg-violet-500' },
  { key: 'monthViews', label: '今月', icon: Globe, accent: 'bg-brand-coral' },
] as const;

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [days, setDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPro = user?.planType === 'PRO' || user?.planType === 'STUDIO';

  useEffect(() => {
    if (!isPro) return;
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [summaryData, timelineData] = await Promise.all([getAnalyticsSummary(), getAnalyticsTimeline(days)]);
        setSummary(summaryData);
        setTimeline(timelineData);
      } catch (err) {
        setError('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isPro, days]);

  if (!isPro) {
    return (
      <div className="space-y-6">
        <PageHeader icon={BarChart3} title="アクセス解析" />
        <motion.div
          className="max-w-md mx-auto border border-slate-200 rounded-lg bg-white p-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-violet-600" />
          </div>
          <h2 className="font-outfit font-bold text-xl mb-2">Pro機能</h2>
          <p className="text-sm text-slate-500 mb-6">アクセス解析はPRO以上のプランで利用できます</p>
          <Link href="/upgrade"><Button>プランをアップグレード</Button></Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader icon={BarChart3} title="アクセス解析" />
        <div className="flex items-center justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader icon={BarChart3} title="アクセス解析" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const maxViews = Math.max(...timeline.map(t => t.views), 1);

  return (
    <div className="space-y-8">
      <PageHeader icon={BarChart3} title="アクセス解析" />

      {/* サマリーカード */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={dashStaggerContainer} initial="hidden" animate="visible">
        {STAT_CONFIG.map((stat) => (
          <motion.div key={stat.key} variants={dashStaggerItem}>
            <div className="border border-slate-200 rounded-lg bg-white p-5 overflow-hidden transition-shadow hover:shadow-sm">
              <div className={`w-full h-1 ${stat.accent} rounded-full mb-3`} />
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-outfit font-black text-slate-900">
                {(summary?.[stat.key] ?? 0).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 期間選択 */}
      <div className="flex gap-2">
        {[7, 14, 30, 60, 90].map(d => (
          <Button key={d} variant={days === d ? 'primary' : 'outline'} size="sm" onClick={() => setDays(d)}>
            {d}日
          </Button>
        ))}
      </div>

      {/* タイムラインバーチャート */}
      <motion.div
        className="border border-slate-200 rounded-lg bg-white overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-6">
          <h2 className="font-outfit font-bold text-lg mb-4">日別アクセス数</h2>
          <div className="space-y-1">
            {timeline.map((entry, i) => (
              <div key={entry.date} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20 shrink-0">
                  {new Date(entry.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.02, ease: 'easeOut' }}
                    style={{ width: `${(entry.views / maxViews) * 100}%`, transformOrigin: 'left' }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-10 text-right">{entry.views}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* トップリファラー */}
      {summary?.topReferrers && summary.topReferrers.length > 0 && (
        <motion.div
          className="border border-slate-200 rounded-lg bg-white overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <h2 className="font-outfit font-bold text-lg mb-4">流入元</h2>
            <div className="space-y-3">
              {summary.topReferrers.map((ref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 truncate">{ref.referrer || '（直接アクセス）'}</span>
                  <span className="text-sm font-bold font-outfit text-slate-900">{ref.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
