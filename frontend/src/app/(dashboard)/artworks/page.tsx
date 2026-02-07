'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getArtworks, updateArtwork, deleteArtwork, Artwork } from '@/lib/artworks';
import { uploadArtwork } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2, ArrowUpDown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradePrompt, LimitBadge } from '@/components/ui/upgrade-prompt';
import { SortableArtworkList } from '@/components/dashboard/sortable-artwork-list';
import { reorderArtworks } from '@/lib/artworks';

const editSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
  imageUrl: z.string().url('有効な画像URLを入力してください'),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const { getLimit } = useSubscription();
  const artworkLimit = getLimit('artworks');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { title: '', description: '', imageUrl: '' },
  });

  const fetchArtworks = async () => {
    try {
      const data = await getArtworks();
      setArtworks(data || []);
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
    setUploadFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadProgress(0);
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    reset({
      title: artwork.title,
      description: artwork.description || '',
      imageUrl: artwork.imageUrl,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!uploadFile) return;

    setIsSaving(true);
    try {
      await uploadArtwork(
        uploadFile,
        {
          title: uploadTitle || uploadFile.name.replace(/\.[^.]+$/, ''),
          description: uploadDescription,
        },
        (percent) => setUploadProgress(percent)
      );
      setIsCreateDialogOpen(false);
      fetchArtworks();
    } catch (error: any) {
      console.error('Failed to upload artwork', error);
      const msg = error.response?.data?.message || '作品のアップロードに失敗しました';
      alert(msg);
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  const onEditSubmit = async (data: EditFormValues) => {
    if (!editingArtwork) return;

    setIsSaving(true);
    try {
      await updateArtwork(editingArtwork.id, {
        ...data,
        description: data.description || '',
      });
      setIsEditDialogOpen(false);
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
        <div className="flex gap-2">
          {artworks.length > 1 && (
            <Button
              variant={isReorderMode ? 'primary' : 'outline'}
              onClick={() => setIsReorderMode(!isReorderMode)}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {isReorderMode ? '並び替え完了' : '並び替え'}
            </Button>
          )}
          <Button onClick={openCreateDialog} disabled={isAtLimit}>
            <Plus className="mr-2 h-4 w-4" /> 新規追加
          </Button>
        </div>
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
      ) : isReorderMode ? (
        <SortableArtworkList
          artworks={artworks}
          onReorder={async (ids) => {
            try {
              await reorderArtworks(ids);
              fetchArtworks();
            } catch (err) {
              console.error('Failed to reorder', err);
              alert('並び替えに失敗しました');
            }
          }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden group">
              <div className="aspect-square w-full relative bg-slate-100 overflow-hidden">
                <img
                  src={artwork.thumbnailUrl || artwork.imageUrl}
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

      {/* Create Dialog - File Upload */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新しい作品を追加</DialogTitle>
            <DialogDescription>
              画像をアップロードして作品を追加します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FileUpload
              onFileSelect={(file) => setUploadFile(file)}
              onRemove={() => setUploadFile(null)}
              uploading={isSaving}
              progress={uploadProgress}
            />

            <div className="space-y-2">
              <Label htmlFor="uploadTitle">タイトル</Label>
              <Input
                id="uploadTitle"
                placeholder="作品のタイトル"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uploadDescription">説明文 (任意)</Label>
              <Textarea
                id="uploadDescription"
                placeholder="作品についての説明"
                className="resize-none h-24"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                キャンセル
              </Button>
              <Button
                onClick={handleCreate}
                isLoading={isSaving}
                disabled={!uploadFile}
              >
                アップロード
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>作品を編集</DialogTitle>
            <DialogDescription>
              作品の情報を編集します。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 py-4">
            {editingArtwork && (
              <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={editingArtwork.imageUrl}
                  alt={editingArtwork.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

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
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" isLoading={isSaving}>
                更新する
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
