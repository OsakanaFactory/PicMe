'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink, SocialLink } from '@/lib/social-links';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';
import { dashStaggerContainer, dashStaggerItem, scaleIn } from '@/lib/motion';
import { Plus, Pencil, Trash2, Link as LinkIcon, Loader2, Twitter, Instagram, Facebook, Youtube, ArrowUpDown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradePrompt, LimitBadge } from '@/components/ui/upgrade-prompt';
import { SortableSocialLinkList } from '@/components/dashboard/sortable-social-link-list';
import { reorderSocialLinks } from '@/lib/social-links';

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'プラットフォームを選択してください'),
  url: z.string().url('有効なURLを入力してください'),
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

const PLATFORMS = [
  { value: 'Twitter', label: 'X (Twitter)', icon: Twitter },
  { value: 'Instagram', label: 'Instagram', icon: Instagram },
  { value: 'Facebook', label: 'Facebook', icon: Facebook },
  { value: 'YouTube', label: 'YouTube', icon: Youtube },
  { value: 'TikTok', label: 'TikTok', icon: LinkIcon },
  { value: 'Website', label: 'Website/Blog', icon: LinkIcon },
  { value: 'Other', label: 'その他', icon: LinkIcon },
];

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const { getLimit } = useSubscription();
  const linkLimit = getLimit('socialLinks');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: { platform: 'Twitter', url: '' },
  });

  const fetchLinks = async () => {
    try { const data = await getSocialLinks(); setLinks(data || []); }
    catch (error) { console.error('Failed to fetch social links', error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchLinks(); }, []);

  const openCreateDialog = () => {
    setEditingLink(null);
    reset({ platform: 'Twitter', url: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link);
    reset({ platform: link.platform, url: link.url });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: SocialLinkFormValues) => {
    setIsSaving(true);
    try {
      if (editingLink) {
        await updateSocialLink(editingLink.id, { ...data, visible: editingLink.visible });
      } else {
        await createSocialLink({ ...data, visible: true });
      }
      setIsDialogOpen(false);
      fetchLinks();
    } catch (error: any) {
      alert(error.response?.data?.message || '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このリンクを削除してもよろしいですか？')) return;
    setIsDeleting(id);
    try { await deleteSocialLink(id); setLinks(links.filter(l => l.id !== id)); }
    catch (error) { alert('削除に失敗しました'); }
    finally { setIsDeleting(null); }
  };

  const getPlatformIcon = (platformName: string) => {
    const platform = PLATFORMS.find(p => p.value === platformName) || PLATFORMS.find(p => p.value === 'Other');
    const Icon = platform?.icon || LinkIcon;
    return <Icon className="h-5 w-5" />;
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  }

  const isAtLimit = linkLimit > 0 && linkLimit !== 2147483647 && links.length >= linkLimit;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LinkIcon}
        title="SNSリンク管理"
        description={`プロフィールに表示するソーシャルメディアやウェブサイトのリンクを管理します${linkLimit > 0 && linkLimit !== 2147483647 ? `（${links.length}/${linkLimit}）` : ''}`}
      >
        {links.length > 1 && (
          <Button variant={isReorderMode ? 'primary' : 'outline'} onClick={() => setIsReorderMode(!isReorderMode)}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {isReorderMode ? '並び替え完了' : '並び替え'}
          </Button>
        )}
        <Button onClick={openCreateDialog} disabled={isAtLimit}>
          <Plus className="mr-2 h-4 w-4" /> リンクを追加
        </Button>
      </PageHeader>

      <UpgradePrompt currentCount={links.length} limit={linkLimit} itemName="SNSリンク" />

      <div className="space-y-4">
        {links.length === 0 ? (
          <motion.div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-300 rounded-lg bg-white" initial="hidden" animate="visible">
            <motion.div variants={scaleIn} className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <LinkIcon className="h-8 w-8 text-slate-400" />
            </motion.div>
            <h3 className="font-outfit font-bold text-lg text-slate-900">リンクがありません</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm">SNSアカウントやブログを追加して、フォロワーと繋がりましょう。</p>
            <Button onClick={openCreateDialog} variant="outline">リンクを追加する</Button>
          </motion.div>
        ) : isReorderMode ? (
          <SortableSocialLinkList
            links={links}
            onReorder={async (ids) => {
              try { await reorderSocialLinks(ids); fetchLinks(); }
              catch (err) { alert('並び替えに失敗しました'); }
            }}
          />
        ) : (
          <motion.div className="space-y-3" variants={dashStaggerContainer} initial="hidden" animate="visible">
            {links.map((link) => (
              <motion.div key={link.id} variants={dashStaggerItem}>
                <motion.div
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 bg-white"
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <motion.div
                      className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                      whileHover={{ rotate: 15 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {getPlatformIcon(link.platform)}
                    </motion.div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-slate-900">{link.platform}</h4>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-blue-600 hover:underline truncate table-cell max-w-xs sm:max-w-md">
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(link.id)} disabled={isDeleting === link.id}>
                      {isDeleting === link.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingLink ? 'リンクを編集' : '新しいリンクを追加'}</DialogTitle>
            <DialogDescription>SNSアカウントやウェブサイトの情報を入力してください。</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">プラットフォーム</Label>
              <Select id="platform" {...register('platform')} error={errors.platform?.message}>
                {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="https://twitter.com/username" {...register('url')} error={errors.url?.message} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
              <Button type="submit" isLoading={isSaving}>{editingLink ? '更新する' : '追加する'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
