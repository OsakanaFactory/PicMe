'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';
import { dashStaggerContainer, dashStaggerItem } from '@/lib/motion';
import { Category, getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/categories';
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
    if (isPro) { loadCategories(); } else { setLoading(false); }
  }, [isPro]);

  const loadCategories = async () => {
    try { setLoading(true); const data = await getCategories(); setCategories(data); setError(null); }
    catch (err) { setError('カテゴリーの取得に失敗しました'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    try { await createCategory({ name: formData.name.trim() }); setFormData({ name: '' }); setIsCreateOpen(false); loadCategories(); }
    catch (err) { setError('カテゴリーの作成に失敗しました'); }
  };

  const handleEdit = async () => {
    if (!editingCategory || !formData.name.trim()) return;
    try { await updateCategory(editingCategory.id, { name: formData.name.trim() }); setFormData({ name: '' }); setEditingCategory(null); setIsEditOpen(false); loadCategories(); }
    catch (err) { setError('カテゴリーの更新に失敗しました'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このカテゴリーを削除しますか？')) return;
    try { await deleteCategory(id); loadCategories(); }
    catch (err) { setError('カテゴリーの削除に失敗しました'); }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsEditOpen(true);
  };

  if (!isPro) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Folder} title="カテゴリー管理" />
        <motion.div
          className="max-w-md mx-auto border border-slate-200 rounded-lg bg-white p-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="font-outfit font-bold text-xl mb-2">Pro機能</h2>
          <p className="text-sm text-slate-500 mb-6">カテゴリー機能はProプラン以上でご利用いただけます</p>
          <Link href="/upgrade"><Button variant="primary">プランをアップグレード</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Folder}
        title="カテゴリー管理"
        description={`作品を分類するカテゴリーを管理します${categoryLimit > 0 && categoryLimit !== 2147483647 ? `（${categories.length}/${categoryLimit}）` : ''}`}
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={isAtLimit}><Plus className="w-4 h-4 mr-2" />カテゴリー追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>カテゴリー追加</DialogTitle><DialogDescription>新しいカテゴリーを作成します</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">カテゴリー名</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} placeholder="例: イラスト" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>キャンセル</Button>
              <Button onClick={handleCreate}>作成</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <UpgradePrompt currentCount={categories.length} limit={categoryLimit} itemName="カテゴリー" />

      {loading ? (
        <div className="text-center py-8 text-slate-500">読み込み中...</div>
      ) : categories.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 rounded-lg bg-white" initial="hidden" animate="visible">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Folder className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-outfit font-bold text-lg mb-2">カテゴリーがありません</h3>
          <p className="text-sm text-slate-500 mb-4">作品を分類するカテゴリーを作成しましょう</p>
          <Button onClick={() => setIsCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />カテゴリーを作成</Button>
        </motion.div>
      ) : (
        <motion.div className="grid gap-3" variants={dashStaggerContainer} initial="hidden" animate="visible">
          {categories.map((category) => (
            <motion.div key={category.id} variants={dashStaggerItem}>
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-slate-500">スラッグ: {category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(category)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(category.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>カテゴリー編集</DialogTitle><DialogDescription>カテゴリー名を変更します</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">カテゴリー名</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>キャンセル</Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
