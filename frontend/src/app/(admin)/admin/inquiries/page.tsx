'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getInquiries, updateInquiryStatus, Inquiry } from '@/lib/admin';
import { MessageSquare, Clock, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: '未対応', color: 'bg-amber-100 text-amber-700', icon: <Clock className="h-4 w-4" /> },
  IN_PROGRESS: { label: '対応中', color: 'bg-blue-100 text-blue-700', icon: <MessageSquare className="h-4 w-4" /> },
  RESOLVED: { label: '解決済み', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-4 w-4" /> },
  CLOSED: { label: 'クローズ', color: 'bg-gray-100 text-gray-700', icon: <XCircle className="h-4 w-4" /> },
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const data = await getInquiries({
        status: statusFilter || undefined,
        page: currentPage,
        size: 20,
      });
      setInquiries(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, statusFilter]);

  const handleStatusUpdate = async (inquiryId: number, newStatus: string) => {
    setUpdateLoading(true);
    try {
      await updateInquiryStatus(inquiryId, { status: newStatus, adminNote: adminNote || undefined });
      setSelectedInquiry(null);
      setAdminNote('');
      fetchInquiries();
    } catch (err) {
      alert('更新に失敗しました');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">問い合わせ管理</h1>

      {/* フィルター */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === '' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => { setStatusFilter(''); setCurrentPage(0); }}
            >
              すべて
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => { setStatusFilter(status); setCurrentPage(0); }}
              >
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 問い合わせリスト */}
        <Card>
          <CardHeader>
            <CardTitle>問い合わせ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {inquiries.map((inquiry) => {
                    const status = statusConfig[inquiry.status];
                    return (
                      <div
                        key={inquiry.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedInquiry?.id === inquiry.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => { setSelectedInquiry(inquiry); setAdminNote(inquiry.adminNote || ''); }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{inquiry.subject}</p>
                            <p className="text-sm text-gray-500">{inquiry.name} - {inquiry.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{inquiry.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(inquiry.createdAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    );
                  })}
                  {inquiries.length === 0 && (
                    <p className="text-gray-500 text-center py-8">問い合わせがありません</p>
                  )}
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

        {/* 詳細パネル */}
        <Card>
          <CardHeader>
            <CardTitle>問い合わせ詳細</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInquiry ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">件名</label>
                  <p className="mt-1 font-medium">{selectedInquiry.subject}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">名前</label>
                    <p className="mt-1">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">メール</label>
                    <p className="mt-1">{selectedInquiry.email}</p>
                  </div>
                </div>

                {selectedInquiry.username && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">ユーザー名</label>
                    <p className="mt-1">{selectedInquiry.username}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">メッセージ</label>
                  <p className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{selectedInquiry.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">管理者メモ</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="mt-1 w-full p-3 border rounded-lg resize-none"
                    rows={3}
                    placeholder="対応メモを入力..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">ステータス変更</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <Button
                        key={status}
                        variant={selectedInquiry.status === status ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusUpdate(selectedInquiry.id, status)}
                        disabled={updateLoading || selectedInquiry.status === status}
                      >
                        {updateLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {config.icon}
                            <span className="ml-1">{config.label}</span>
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">問い合わせを選択してください</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
