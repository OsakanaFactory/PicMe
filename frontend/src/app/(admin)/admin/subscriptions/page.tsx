'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSubscriptionStats, SubscriptionStats } from '@/lib/admin';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';

const planColors: Record<string, string> = {
  FREE: 'bg-gray-500',
  STARTER: 'bg-blue-500',
  PRO: 'bg-purple-500',
  STUDIO: 'bg-amber-500',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  TRIALING: 'bg-blue-100 text-blue-700',
  PAST_DUE: 'bg-amber-100 text-amber-700',
  CANCELED: 'bg-red-100 text-red-700',
};

export default function AdminSubscriptionsPage() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSubscriptionStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch subscription stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">データの取得に失敗しました</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">サブスクリプション管理</h1>

      {/* 収益サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">月間経常収益 (MRR)</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{stats.mrr.toLocaleString()}</div>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              前月比 +12.5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">年間収益予測</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{(stats.mrr * 12).toLocaleString()}</div>
            <p className="text-sm text-gray-500">MRR × 12ヶ月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">解約率</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.churnRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-500">月間チャーンレート</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* プラン別統計 */}
        <Card>
          <CardHeader>
            <CardTitle>プラン別統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(stats.planStats).map(([plan, data]) => (
                <div key={plan} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${planColors[plan]}`} />
                      <span className="font-medium">{plan}</span>
                    </div>
                    <span className="text-lg font-bold">{data.count}人</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>シェア: {data.percentage.toFixed(1)}%</span>
                    <span>収益: ¥{data.monthlyRevenue.toLocaleString()}/月</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${planColors[plan]}`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近のサブスクリプション */}
        <Card>
          <CardHeader>
            <CardTitle>最近のサブスクリプション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentSubscriptions.map((sub, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{sub.username}</p>
                    <p className="text-sm text-gray-500">{sub.startDate || '-'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${planColors[sub.planType]}`}>
                      {sub.planType}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[sub.status] || 'bg-gray-100 text-gray-700'}`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
              {stats.recentSubscriptions.length === 0 && (
                <p className="text-gray-500 text-center py-4">サブスクリプションがありません</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
