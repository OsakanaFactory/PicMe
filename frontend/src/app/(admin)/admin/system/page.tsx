'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemMetrics, SystemMetrics } from '@/lib/admin';
import { Cpu, HardDrive, Database, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  normal: 'text-green-500',
  warning: 'text-amber-500',
  critical: 'text-red-500',
};

const progressColors: Record<string, string> = {
  normal: 'bg-green-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
};

export default function AdminSystemPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await getSystemMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // 30秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">システム監視</h1>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            更新
          </Button>
        </div>
      </div>

      {/* リソース使用率 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">CPU使用率</CardTitle>
            <Cpu className={`h-5 w-5 ${statusColors[metrics.cpu.status]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.cpu.usagePercent.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={`h-3 rounded-full transition-all ${progressColors[metrics.cpu.status]}`}
                style={{ width: `${Math.min(metrics.cpu.usagePercent, 100)}%` }}
              />
            </div>
            <p className={`text-sm mt-2 capitalize ${statusColors[metrics.cpu.status]}`}>
              {metrics.cpu.status === 'normal' ? '正常' : metrics.cpu.status === 'warning' ? '警告' : '危険'}
            </p>
          </CardContent>
        </Card>

        {/* メモリ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">メモリ使用率</CardTitle>
            <HardDrive className={`h-5 w-5 ${statusColors[metrics.memory.status]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.memory.usagePercent.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={`h-3 rounded-full transition-all ${progressColors[metrics.memory.status]}`}
                style={{ width: `${Math.min(metrics.memory.usagePercent, 100)}%` }}
              />
            </div>
            <p className={`text-sm mt-2 capitalize ${statusColors[metrics.memory.status]}`}>
              {metrics.memory.status === 'normal' ? '正常' : metrics.memory.status === 'warning' ? '警告' : '危険'}
            </p>
          </CardContent>
        </Card>

        {/* ディスク */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ディスク使用率</CardTitle>
            <HardDrive className={`h-5 w-5 ${statusColors[metrics.disk.status]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.disk.usagePercent.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={`h-3 rounded-full transition-all ${progressColors[metrics.disk.status]}`}
                style={{ width: `${Math.min(metrics.disk.usagePercent, 100)}%` }}
              />
            </div>
            <p className={`text-sm mt-2 capitalize ${statusColors[metrics.disk.status]}`}>
              {metrics.disk.status === 'normal' ? '正常' : metrics.disk.status === 'warning' ? '警告' : '危険'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* データベース */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>データベース</CardTitle>
            <Database className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">アクティブ接続数</span>
                <span className="font-bold">
                  {metrics.database.activeConnections} / {metrics.database.maxConnections}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(metrics.database.activeConnections / metrics.database.maxConnections) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">平均レスポンス時間</span>
                <span className="font-bold">{metrics.database.avgResponseTimeMs.toFixed(1)}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* エラー統計 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>エラー統計</CardTitle>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">5xx エラー（サーバー）</span>
                <span className={`font-bold ${metrics.errors.error5xx > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {metrics.errors.error5xx}件
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">4xx エラー（クライアント）</span>
                <span className={`font-bold ${metrics.errors.error4xx > 10 ? 'text-amber-500' : 'text-green-500'}`}>
                  {metrics.errors.error4xx}件
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">集計期間</span>
                <span className="text-gray-600">{metrics.errors.period}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* システムアラート */}
      <Card>
        <CardHeader>
          <CardTitle>システムアラート</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.cpu.status === 'normal' &&
           metrics.memory.status === 'normal' &&
           metrics.disk.status === 'normal' &&
           metrics.errors.error5xx === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-green-700">すべてのシステムが正常に稼働しています</span>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.cpu.status !== 'normal' && (
                <div className={`flex items-center gap-3 p-4 rounded-lg ${metrics.cpu.status === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <div className={`w-3 h-3 rounded-full ${metrics.cpu.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className={metrics.cpu.status === 'warning' ? 'text-amber-700' : 'text-red-700'}>
                    CPU使用率が高くなっています ({metrics.cpu.usagePercent.toFixed(1)}%)
                  </span>
                </div>
              )}
              {metrics.memory.status !== 'normal' && (
                <div className={`flex items-center gap-3 p-4 rounded-lg ${metrics.memory.status === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <div className={`w-3 h-3 rounded-full ${metrics.memory.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className={metrics.memory.status === 'warning' ? 'text-amber-700' : 'text-red-700'}>
                    メモリ使用率が高くなっています ({metrics.memory.usagePercent.toFixed(1)}%)
                  </span>
                </div>
              )}
              {metrics.disk.status !== 'normal' && (
                <div className={`flex items-center gap-3 p-4 rounded-lg ${metrics.disk.status === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <div className={`w-3 h-3 rounded-full ${metrics.disk.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className={metrics.disk.status === 'warning' ? 'text-amber-700' : 'text-red-700'}>
                    ディスク使用率が高くなっています ({metrics.disk.usagePercent.toFixed(1)}%)
                  </span>
                </div>
              )}
              {metrics.errors.error5xx > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-red-700">
                    サーバーエラーが発生しています ({metrics.errors.error5xx}件)
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
