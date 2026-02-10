'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';
import { dashStaggerContainer, dashStaggerItem, scaleIn, dashFadeIn } from '@/lib/motion';
import { Tag as TagType, getTags, createTag, deleteTag } from '@/lib/tags';
import { Plus, Tag, Trash2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function TagsPage() {
  const { user } = useAuth();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const isPro = user?.planType === 'PRO' || user?.planType === 'STUDIO';

  useEffect(() => {
    if (isPro) { loadTags(); } else { setLoading(false); }
  }, [isPro]);

  const loadTags = async () => {
    try { setLoading(true); const data = await getTags(); setTags(data); setError(null); }
    catch (err) { setError('タグの取得に失敗しました'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    try { await createTag(newTagName.trim()); setNewTagName(''); setIsCreateOpen(false); loadTags(); }
    catch (err) { setError('タグの作成に失敗しました'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このタグを削除しますか？')) return;
    try { await deleteTag(id); loadTags(); }
    catch (err) { setError('タグの削除に失敗しました'); }
  };

  if (!isPro) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Tag} title="タグ管理" />
        <motion.div
          className="max-w-md mx-auto border-2 border-slate-900 shadow-[4px_4px_0px_#1A1A1A] rounded-lg bg-white p-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <Lock className="w-6 h-6 text-amber-600" />
          </motion.div>
          <h2 className="font-outfit font-bold text-xl mb-2">Pro機能</h2>
          <p className="text-sm text-slate-500 mb-6">タグ機能はProプラン以上でご利用いただけます</p>
          <Link href="/upgrade"><Button variant="primary">プランをアップグレード</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={Tag} title="タグ管理" description="作品に付けるタグを管理します">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />タグ追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>タグ追加</DialogTitle><DialogDescription>新しいタグを作成します</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">タグ名</Label>
                <Input id="name" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="例: 風景" onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }} />
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

      {loading ? (
        <div className="text-center py-8 text-slate-500">読み込み中...</div>
      ) : tags.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-300 rounded-lg bg-white" initial="hidden" animate="visible">
          <motion.div variants={scaleIn} className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-slate-400" />
          </motion.div>
          <h3 className="font-outfit font-bold text-lg mb-2">タグがありません</h3>
          <p className="text-sm text-slate-500 mb-4">作品に付けるタグを作成しましょう</p>
          <Button onClick={() => setIsCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />タグを作成</Button>
        </motion.div>
      ) : (
        <motion.div className="space-y-6" variants={dashStaggerContainer} initial="hidden" animate="visible">
          <motion.div
            className="border-2 border-slate-200 rounded-lg bg-white p-6"
            variants={dashStaggerItem}
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.div
                  key={tag.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-green/20 text-slate-900 rounded-full text-sm border border-brand-green/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag.name}</span>
                  <button onClick={() => handleDelete(tag.id)} className="hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="border-2 border-slate-200 rounded-lg bg-white overflow-hidden"
            variants={dashStaggerItem}
          >
            <div className="p-6">
              <h3 className="font-outfit font-bold text-lg mb-2">タグの使い方</h3>
              <div className="text-sm text-slate-500 space-y-2">
                <p>作品編集画面でタグを選択または新規作成できます。</p>
                <p>タグを使うと、公開ページで作品をフィルタリングできます。</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
