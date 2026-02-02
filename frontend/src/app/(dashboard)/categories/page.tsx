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
import {
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/categories';
import { Plus, Edit2, Trash2, Folder, Lock } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradePrompt, LimitBadge } from '@/components/ui/upgrade-prompt';
import Link from 'next/link';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { getLimit } = useSubscription();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const isPro = user?.planType === 'PRO' || user?.planType === 'STUDIO';
  const categoryLimit = getLimit('categories');
  const isAtLimit = categoryLimit > 0 && categoryLimit !== 2147483647 && categories.length >= categoryLimit;

  useEffect(() => {
    if (isPro) {
      loadCategories();
    } else {
      setLoading(false);
    }
  }, [isPro]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('カテゴリーの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      await createCategory({ name: formData.name.trim() });
      setFormData({ name: '' });
      setIsCreateOpen(false);
      loadCategories();
    } catch (err) {
      setError('カテゴリーの作成に失敗しました');
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!editingCategory || !formData.name.trim()) return;

    try {
      await updateCategory(editingCategory.id, { name: formData.name.trim() });
      setFormData({ name: '' });
      setEditingCategory(null);
      setIsEditOpen(false);
      loadCategories();
    } catch (err) {
      setError('カテゴリーの更新に失敗しました');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このカテゴリーを削除しますか？')) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError('カテゴリーの削除に失敗しました');
      console.error(err);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsEditOpen(true);
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
              カテゴリー機能はProプラン以上でご利用いただけます
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/upgrade">
              <Button variant="default">
                プランをアップグレード
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">カテゴリー管理</h1>
          <p className="text-muted-foreground">
            作品を分類するカテゴリーを管理します
            {categoryLimit > 0 && categoryLimit !== 2147483647 && (
              <span className="ml-2">
                （<LimitBadge current={categories.length} limit={categoryLimit} />）
              </span>
            )}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={isAtLimit}>
              <Plus className="w-4 h-4 mr-2" />
              カテゴリー追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>カテゴリー追加</DialogTitle>
              <DialogDescription>
                新しいカテゴリーを作成します
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">カテゴリー名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="例: イラスト"
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

      <UpgradePrompt
        currentCount={categories.length}
        limit={categoryLimit}
        itemName="カテゴリー"
      />

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">カテゴリーがありません</h3>
            <p className="text-muted-foreground mb-4">
              作品を分類するカテゴリーを作成しましょう
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              カテゴリーを作成
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      スラッグ: {category.slug}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>カテゴリー編集</DialogTitle>
            <DialogDescription>
              カテゴリー名を変更します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">カテゴリー名</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
