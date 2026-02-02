'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getArtworks, createArtwork, updateArtwork, deleteArtwork, Artwork } from '@/lib/artworks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradePrompt, LimitBadge } from '@/components/ui/upgrade-prompt';

const artworkSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
  imageUrl: z.string().url('有効な画像URLを入力してください'),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { getLimit } = useSubscription();
  const artworkLimit = getLimit('artworks');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
    },
  });

  const fetchArtworks = async () => {
    try {
      const data = await getArtworks();
      setArtworks(data || []); // Ensure array
    } catch (error) {
      console.error('Failed to fetch artworks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const openCreateDialog = () => {
    setEditingArtwork(null);
    reset({
      title: '',
      description: '',
      imageUrl: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    reset({
      title: artwork.title,
      description: artwork.description || '',
      imageUrl: artwork.imageUrl,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ArtworkFormValues) => {
    setIsSaving(true);
    try {
      if (editingArtwork) {
        await updateArtwork(editingArtwork.id, {
          ...data,
          description: data.description || '',
        });
      } else {
        await createArtwork({
          ...data,
          description: data.description || '',
        });
      }
      setIsDialogOpen(false);
      fetchArtworks();
    } catch (error: any) {
      console.error('Failed to save artwork', error);
      const msg = error.response?.data?.message || '作品の保存に失敗しました';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この作品を削除してもよろしいですか？')) return;
    
    setIsDeleting(id);
    try {
      await deleteArtwork(id);
      setArtworks(artworks.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete artwork', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const isAtLimit = artworkLimit > 0 && artworks.length >= artworkLimit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">作品管理</h1>
          <p className="text-slate-500">
            ポートフォリオに表示する作品を追加・編集します
            {artworkLimit > 0 && (
              <span className="ml-2">
                （<LimitBadge current={artworks.length} limit={artworkLimit} />）
              </span>
            )}
          </p>
        </div>
        <Button onClick={openCreateDialog} disabled={isAtLimit}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>

      <UpgradePrompt
        currentCount={artworks.length}
        limit={artworkLimit}
        itemName="作品"
      />

      {artworks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">作品がありません</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm">
              最初の作品をアップロードして、あなたのクリエイティビティを世界に公開しましょう。
            </p>
            <Button onClick={openCreateDialog} variant="outline">
              作品を追加する
            </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden group">
              <div className="aspect-square w-full relative bg-slate-100 overflow-hidden">
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-slate-400">No Image</span>';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg truncate" title={artwork.title}>{artwork.title}</h3>
                <p className="text-sm text-slate-500 truncate mt-1">
                  {artwork.description || '説明なし'}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(artwork)}>
                  <Pencil className="h-4 w-4 mr-1" /> 編集
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(artwork.id)}
                  disabled={isDeleting === artwork.id}
                >
                  {isDeleting === artwork.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  削除
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit API Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingArtwork ? '作品を編集' : '新しい作品を追加'}</DialogTitle>
            <DialogDescription>
              作品の情報を入力してください。画像はURLで指定します。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="作品のタイトル"
                {...register('title')}
                error={errors.title?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">画像URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                {...register('imageUrl')}
                error={errors.imageUrl?.message}
              />
              <p className="text-xs text-slate-500">※ 画像ホスティングサービスのURLを入力してください</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明文 (任意)</Label>
              <Textarea
                id="description"
                placeholder="作品についての説明"
                className="resize-none h-24"
                {...register('description')}
                error={errors.description?.message}
              />
            </div>



            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" isLoading={isSaving}>
                {editingArtwork ? '更新する' : '追加する'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
