'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboard, DashboardStats } from '@/lib/admin';
import { Users, CreditCard, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';

const planColors: Record<string, string> = {
  FREE: 'bg-gray-500',
  STARTER: 'bg-blue-500',
  PRO: 'bg-purple-500',
  STUDIO: 'bg-amber-500',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboard();
        setStats(data);
      } catch (err: any) {
        setError('データの取得に失敗しました');
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

  if (error || !stats) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">総ユーザー数</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-sm text-gray-500">有料: {stats.paidUsers}人</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">月間収益</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-sm text-gray-500">サブスクリプション収益</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">広告収益</CardTitle>
            <CreditCard className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{stats.adRevenue.toLocaleString()}</div>
            <p className="text-sm text-gray-500">AdSense推定収益</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">未対応問い合わせ</CardTitle>
            <MessageSquare className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingInquiries}</div>
            <p className="text-sm text-gray-500">対応待ち</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* プラン分布 */}
        <Card>
          <CardHeader>
            <CardTitle>プラン分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.usersByPlan).map(([plan, count]) => (
                <div key={plan}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{plan}</span>
                    <span className="text-gray-500">
                      {count}人 ({stats.usersByPlanPercentage[plan]?.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${planColors[plan] || 'bg-gray-500'}`}
                      style={{ width: `${stats.usersByPlanPercentage[plan] || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近のユーザー */}
        <Card>
          <CardHeader>
            <CardTitle>最近の登録ユーザー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.createdAt}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${planColors[user.planType] || 'bg-gray-500'}`}>
                    {user.planType}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
