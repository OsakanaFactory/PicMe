'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/profile';
import { uploadAvatar, uploadHeader } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { PageHeader } from '@/components/ui/page-header';
import { dashStaggerContainer, dashStaggerItem, dashFadeIn } from '@/lib/motion';
import { User, Palette, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(1, '表示名は必須です').max(50, '表示名は50文字以内で入力してください'),
  bio: z.string().max(160, '自己紹介は160文字以内で入力してください').optional(),
  theme: z.string(),
  fontFamily: z.string(),
  layout: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [headerUrl, setHeaderUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [headerUploading, setHeaderUploading] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [headerProgress, setHeaderProgress] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      theme: 'LIGHT',
      fontFamily: 'SANS_SERIF',
      layout: 'STANDARD',
    },
  });

  const formValues = watch();

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        reset({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          theme: profile.theme || 'LIGHT',
          fontFamily: profile.fontFamily || 'SANS_SERIF',
          layout: profile.layout || 'STANDARD',
        });
        setAvatarUrl(profile.avatarUrl || '');
        setHeaderUrl(profile.headerUrl || '');
      } catch (error) {
        setMessage({ type: 'error', text: 'プロフィールの読み込みに失敗しました' });
      } finally {
        setIsLoading(false);
      }
    }
    if (user) loadProfile();
  }, [user, reset]);

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    setAvatarProgress(0);
    try {
      const profile = await uploadAvatar(file, (p) => setAvatarProgress(p));
      setAvatarUrl(profile.avatarUrl || '');
      setMessage({ type: 'success', text: 'アバターを更新しました' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'アバターのアップロードに失敗しました' });
    } finally {
      setAvatarUploading(false);
      setAvatarProgress(0);
    }
  };

  const handleHeaderUpload = async (file: File) => {
    setHeaderUploading(true);
    setHeaderProgress(0);
    try {
      const profile = await uploadHeader(file, (p) => setHeaderProgress(p));
      setHeaderUrl(profile.headerUrl || '');
      setMessage({ type: 'success', text: 'ヘッダーを更新しました' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'ヘッダーのアップロードに失敗しました' });
    } finally {
      setHeaderUploading(false);
      setHeaderProgress(0);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setMessage(null);
    try {
      await updateProfile(data);
      setMessage({ type: 'success', text: 'プロフィールを更新しました' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '更新に失敗しました。再度お試しください。' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={User}
        title="プロフィール編集"
        description="あなたの公開プロフィールの情報を編集します。"
      />

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={dashStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={dashStaggerItem}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#1A1A1A] rounded-lg overflow-hidden"
              whileHover={{ y: -2 }}
            >
              <div className="w-full h-1.5 bg-brand-green" />
              <div className="p-6">
                <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-1">
                  <User className="h-5 w-5" /> 基本情報
                </h3>
                <p className="text-sm text-slate-500 mb-4">ユーザー名や自己紹介を設定します</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">表示名</Label>
                    <Input id="displayName" placeholder="あなたの名前" {...register('displayName')} error={errors.displayName?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">自己紹介</Label>
                    <Textarea id="bio" placeholder="自己紹介を入力してください（160文字以内）" className="resize-none h-32" {...register('bio')} error={errors.bio?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label>アイコン画像</Label>
                    <FileUpload compact label="アイコンを変更" previewUrl={avatarUrl} onFileSelect={handleAvatarUpload} uploading={avatarUploading} progress={avatarProgress} />
                  </div>
                  <div className="space-y-2">
                    <Label>ヘッダー画像</Label>
                    <FileUpload compact label="ヘッダーを変更" previewUrl={headerUrl} onFileSelect={handleHeaderUpload} uploading={headerUploading} progress={headerProgress} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#1A1A1A] rounded-lg overflow-hidden"
              whileHover={{ y: -2 }}
            >
              <div className="w-full h-1.5 bg-brand-coral" />
              <div className="p-6">
                <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-1">
                  <Palette className="h-5 w-5" /> デザイン設定
                </h3>
                <p className="text-sm text-slate-500 mb-4">ページの見た目をカスタマイズします</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">テーマカラー</Label>
                    <Select id="theme" {...register('theme')} error={errors.theme?.message}>
                      <option value="LIGHT">ライト（デフォルト）</option>
                      <option value="DARK">ダーク</option>
                      <option value="PASTEL">パステル</option>
                      <option value="VIBRANT">ビビッド</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">フォント</Label>
                    <Select id="fontFamily" {...register('fontFamily')} error={errors.fontFamily?.message}>
                      <option value="SANS_SERIF">モダン (Sans Serif)</option>
                      <option value="SERIF">クラシック (Serif)</option>
                      <option value="MONOSPACE">モノスペース</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="layout">レイアウト</Label>
                    <Select id="layout" {...register('layout')} error={errors.layout?.message}>
                      <option value="STANDARD">スタンダード</option>
                      <option value="GRID">グリッド</option>
                      <option value="MINIMAL">ミニマル</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`rounded-md p-3 text-sm border ${
                        message.type === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button type="submit" className="w-full" isLoading={isSaving} disabled={!isDirty}>
                  変更を保存
                </Button>
              </div>
            </motion.div>
          </form>
        </motion.div>

        {/* Preview */}
        <motion.div variants={dashStaggerItem}>
          <motion.div
            className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden sticky top-4"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="p-6">
              <h3 className="font-outfit font-bold text-lg mb-1">プレビュー</h3>
              <p className="text-sm text-slate-500 mb-4">実際の表示イメージ（簡易版）</p>

              <motion.div
                className={`aspect-[9/16] w-full max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative font-${(formValues.fontFamily === 'SERIF' ? 'serif' : formValues.fontFamily === 'MONOSPACE' ? 'mono' : 'sans')}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="h-32 bg-slate-200 w-full relative">
                  {headerUrl && (
                    <img src={headerUrl} alt="Header" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
                <div className="absolute top-24 left-4 h-20 w-20 rounded-full bg-slate-100 border-4 border-white overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="mt-14 px-4 space-y-2">
                  <div className="font-bold text-lg text-slate-900">{formValues.displayName || 'ユーザー名'}</div>
                  <div className="text-sm text-slate-500">@{user?.username}</div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">{formValues.bio || '自己紹介がここに入ります'}</div>
                </div>
                <div className="mt-8 px-4 grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded" />
                  ))}
                </div>
              </motion.div>
              <p className="text-center text-xs text-slate-400 mt-4">※ 実際の公開ページとは表示が異なる場合があります</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
