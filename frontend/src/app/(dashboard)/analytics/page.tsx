'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalyticsSummary, getAnalyticsTimeline, AnalyticsSummary, TimelineEntry } from '@/lib/analytics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Eye, TrendingUp, Globe, Loader2 } from 'lucide-react';

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
        const [summaryData, timelineData] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsTimeline(days),
        ]);
        setSummary(summaryData);
        setTimeline(timelineData);
      } catch (err) {
        console.error('Failed to load analytics', err);
        setError('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isPro, days]);

  if (!isPro) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">アクセス解析</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">アクセス解析はPRO以上のプランで利用できます</p>
            <Button onClick={() => window.location.href = '/upgrade'}>プランをアップグレード</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // タイムラインの最大値（バーチャート用）
  const maxViews = Math.max(...timeline.map(t => t.views), 1);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">アクセス解析</h1>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-slate-500">総PV</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{summary?.totalViews?.toLocaleString() ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm text-slate-500">今日</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{summary?.todayViews?.toLocaleString() ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-slate-500">今週</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{summary?.weekViews?.toLocaleString() ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-slate-500">今月</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{summary?.monthViews?.toLocaleString() ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* 期間選択 */}
      <div className="flex gap-2">
        {[7, 14, 30, 60, 90].map(d => (
          <Button
            key={d}
            variant={days === d ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setDays(d)}
          >
            {d}日
          </Button>
        ))}
      </div>

      {/* タイムラインバーチャート（CSS描画） */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">日別アクセス数</h2>
          <div className="space-y-1">
            {timeline.map(entry => (
              <div key={entry.date} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20 shrink-0">
                  {new Date(entry.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded transition-all duration-300"
                    style={{ width: `${(entry.views / maxViews) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-10 text-right">{entry.views}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* トップリファラー */}
      {summary?.topReferrers && summary.topReferrers.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">流入元</h2>
            <div className="space-y-3">
              {summary.topReferrers.map((ref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 truncate">{ref.referrer || '（直接アクセス）'}</span>
                  <span className="text-sm font-medium text-slate-900">{ref.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
