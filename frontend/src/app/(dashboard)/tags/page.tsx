'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tag as TagType, getTags, createTag, deleteTag } from '@/lib/tags';
import { Plus, Tag, Trash2, Lock } from 'lucide-react';

export default function TagsPage() {
  const { user } = useAuth();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const isPro = user?.planType === 'PRO' || user?.planType === 'STUDIO';

  useEffect(() => {
    if (isPro) {
      loadTags();
    } else {
      setLoading(false);
    }
  }, [isPro]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await getTags();
      setTags(data);
      setError(null);
    } catch (err) {
      setError('タグの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName.trim());
      setNewTagName('');
      setIsCreateOpen(false);
      loadTags();
    } catch (err) {
      setError('タグの作成に失敗しました');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このタグを削除しますか？')) return;

    try {
      await deleteTag(id);
      loadTags();
    } catch (err) {
      setError('タグの削除に失敗しました');
      console.error(err);
    }
  };

  if (!isPro) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle>Pro機能</CardTitle>
            <CardDescription>
              タグ機能はProプラン以上でご利用いただけます
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="primary">
              プランをアップグレード
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">タグ管理</h1>
          <p className="text-muted-foreground">作品に付けるタグを管理します</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              タグ追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>タグ追加</DialogTitle>
              <DialogDescription>
                新しいタグを作成します
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">タグ名</Label>
                <Input
                  id="name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="例: 風景"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreate();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleCreate}>作成</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : tags.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">タグがありません</h3>
            <p className="text-muted-foreground mb-4">
              作品に付けるタグを作成しましょう
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              タグを作成
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag.name}</span>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">タグの使い方</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>作品編集画面でタグを選択または新規作成できます。</p>
            <p>タグを使うと、公開ページで作品をフィルタリングできます。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
