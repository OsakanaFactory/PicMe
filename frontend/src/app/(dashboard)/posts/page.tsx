'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getPosts, createPost, updatePost, deletePost, togglePostVisibility, Post } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, FileText, Loader2, Eye, EyeOff } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradePrompt, LimitBadge } from '@/components/ui/upgrade-prompt';
import { MarkdownEditor } from '@/components/dashboard/markdown-editor';
import { useAuth } from '@/contexts/AuthContext';

const postSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  content: z.string().min(1, '本文は必須です'),
  thumbnailUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  visible: z.boolean().default(true),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [useMarkdown, setUseMarkdown] = useState(false);
  const { getLimit } = useSubscription();
  const { user } = useAuth();
  const isPro = user?.planType === 'PRO' || user?.planType === 'STUDIO';
  const postLimit = getLimit('posts');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      thumbnailUrl: '',
      visible: true,
    },
  });

  const watchVisible = watch('visible');

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateDialog = () => {
    setEditingPost(null);
    setUseMarkdown(false);
    reset({
      title: '',
      content: '',
      thumbnailUrl: '',
      visible: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setUseMarkdown(post.contentFormat === 'MARKDOWN');
    reset({
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl || '',
      visible: post.visible,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: PostFormValues) => {
    setIsSaving(true);
    try {
      const contentFormat = useMarkdown ? 'MARKDOWN' : 'PLAIN';
      if (editingPost) {
        await updatePost(editingPost.id, {
          title: data.title,
          content: data.content,
          contentFormat,
          thumbnailUrl: data.thumbnailUrl || undefined,
          visible: data.visible,
        });
      } else {
        await createPost({
          title: data.title,
          content: data.content,
          contentFormat,
          thumbnailUrl: data.thumbnailUrl || undefined,
          visible: data.visible,
        });
      }
      setIsDialogOpen(false);
      fetchPosts();
    } catch (error: any) {
      console.error('Failed to save post', error);
      const msg = error.response?.data?.message || 'お知らせの保存に失敗しました';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このお知らせを削除してもよろしいですか？')) return;

    setIsDeleting(id);
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleVisibility = async (id: number) => {
    setIsToggling(id);
    try {
      const updatedPost = await togglePostVisibility(id);
      setPosts(posts.map(p => p.id === id ? updatedPost : p));
    } catch (error) {
      console.error('Failed to toggle visibility', error);
      alert('公開状態の変更に失敗しました');
    } finally {
      setIsToggling(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const isAtLimit = postLimit > 0 && postLimit !== 2147483647 && posts.length >= postLimit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">お知らせ管理</h1>
          <p className="text-slate-500">
            お知らせやブログ記事を投稿・管理します
            {postLimit > 0 && postLimit !== 2147483647 && (
              <span className="ml-2">
                （<LimitBadge current={posts.length} limit={postLimit} />）
              </span>
            )}
          </p>
        </div>
        <Button onClick={openCreateDialog} disabled={isAtLimit}>
          <Plus className="mr-2 h-4 w-4" /> 新規投稿
        </Button>
      </div>

      <UpgradePrompt
        currentCount={posts.length}
        limit={postLimit}
        itemName="お知らせ"
      />

      {posts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">お知らせがありません</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm">
            最初のお知らせを投稿して、あなたのファンに近況を伝えましょう。
          </p>
          <Button onClick={openCreateDialog} variant="outline">
            お知らせを投稿する
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {post.thumbnailUrl && (
                  <div className="sm:w-48 h-32 sm:h-auto bg-slate-100 flex-shrink-0">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate" title={post.title}>
                          {post.title}
                        </h3>
                        {post.visible ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            公開中
                          </span>
                        ) : (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            下書き
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>投稿日: {formatDate(post.createdAt)}</span>
                        {post.visible && post.publishedAt && (
                          <span>公開日: {formatDate(post.publishedAt)}</span>
                        )}
                        <span>閲覧数: {post.viewCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(post.id)}
                        disabled={isToggling === post.id}
                        title={post.visible ? '非公開にする' : '公開する'}
                      >
                        {isToggling === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : post.visible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                      >
                        {isDeleting === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Post Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'お知らせを編集' : '新しいお知らせを投稿'}</DialogTitle>
            <DialogDescription>
              お知らせの内容を入力してください。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="お知らせのタイトル"
                {...register('title')}
                error={errors.title?.message}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">本文</Label>
                {isPro && (
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded ${useMarkdown ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-colors`}
                    onClick={() => setUseMarkdown(!useMarkdown)}
                  >
                    {useMarkdown ? 'Markdown ON' : 'Markdown OFF'}
                  </button>
                )}
              </div>
              {useMarkdown && isPro ? (
                <MarkdownEditor
                  value={watch('content')}
                  onChange={(val) => setValue('content', val, { shouldValidate: true })}
                  height={300}
                  placeholder="マークダウンで記述できます"
                />
              ) : (
                <Textarea
                  id="content"
                  placeholder="お知らせの本文を入力してください"
                  className="resize-none h-48"
                  {...register('content')}
                  error={errors.content?.message}
                />
              )}
              {!isPro && (
                <p className="text-xs text-slate-500">
                  ※ Proプラン以上でマークダウン記法が使用可能です
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">サムネイル画像URL (任意)</Label>
              <Input
                id="thumbnailUrl"
                placeholder="https://example.com/image.jpg"
                {...register('thumbnailUrl')}
                error={errors.thumbnailUrl?.message}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="visible"
                {...register('visible')}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="visible" className="text-sm font-normal cursor-pointer">
                すぐに公開する
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" isLoading={isSaving}>
                {editingPost ? '更新する' : '投稿する'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
