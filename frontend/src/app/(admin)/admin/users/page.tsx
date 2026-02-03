'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsers, suspendUser, activateUser, AdminUser } from '@/lib/admin';
import { Search, UserX, UserCheck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const planColors: Record<string, string> = {
  FREE: 'bg-gray-500',
  STARTER: 'bg-blue-500',
  PRO: 'bg-purple-500',
  STUDIO: 'bg-amber-500',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers({
        search: search || undefined,
        planType: planFilter || undefined,
        page: currentPage,
        size: 20,
      });
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, planFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  const handleSuspend = async (userId: number) => {
    if (!confirm('このユーザーを停止しますか？')) return;
    setActionLoading(userId);
    try {
      await suspendUser(userId);
      fetchUsers();
    } catch (err) {
      alert('操作に失敗しました');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (userId: number) => {
    setActionLoading(userId);
    try {
      await activateUser(userId);
      fetchUsers();
    } catch (err) {
      alert('操作に失敗しました');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>

      {/* フィルター */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                placeholder="ユーザー名またはメールで検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 border rounded-md bg-white"
            >
              <option value="">全プラン</option>
              <option value="FREE">FREE</option>
              <option value="STARTER">STARTER</option>
              <option value="PRO">PRO</option>
              <option value="STUDIO">STUDIO</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ユーザーリスト */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">ユーザー</th>
                      <th className="pb-3 font-medium">プラン</th>
                      <th className="pb-3 font-medium">利用状況</th>
                      <th className="pb-3 font-medium">ステータス</th>
                      <th className="pb-3 font-medium">登録日</th>
                      <th className="pb-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${planColors[user.planType] || 'bg-gray-500'}`}>
                            {user.planType}
                          </span>
                        </td>
                        <td className="py-4 text-sm">
                          <div>作品: {user.usage.artworkCount}/{user.usage.artworkLimit}</div>
                          <div>SNS: {user.usage.socialLinkCount}/{user.usage.socialLinkLimit}</div>
                        </td>
                        <td className="py-4">
                          {user.isActive ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">有効</span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">停止</span>
                          )}
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="py-4">
                          {user.isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(user.id)}
                              disabled={actionLoading === user.id}
                              className="text-red-600 hover:bg-red-50"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  停止
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivate(user.id)}
                              disabled={actionLoading === user.id}
                              className="text-green-600 hover:bg-green-50"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  有効化
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
