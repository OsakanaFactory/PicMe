'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/profile';
import { uploadAvatar, uploadHeader } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { User, Palette } from 'lucide-react';

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

    if (user) {
      loadProfile();
    }
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
      const msg = error.response?.data?.message || 'アバターのアップロードに失敗しました';
      setMessage({ type: 'error', text: msg });
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
      const msg = error.response?.data?.message || 'ヘッダーのアップロードに失敗しました';
      setMessage({ type: 'error', text: msg });
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
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">プロフィール編集</h1>
        <p className="text-slate-500">
          あなたの公開プロフィールの情報を編集します。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> 基本情報
              </CardTitle>
              <CardDescription>
                ユーザー名や自己紹介を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">表示名</Label>
                <Input
                  id="displayName"
                  placeholder="あなたの名前"
                  {...register('displayName')}
                  error={errors.displayName?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">自己紹介</Label>
                <Textarea
                  id="bio"
                  placeholder="自己紹介を入力してください（160文字以内）"
                  className="resize-none h-32"
                  {...register('bio')}
                  error={errors.bio?.message}
                />
              </div>

              <div className="space-y-2">
                <Label>アイコン画像</Label>
                <FileUpload
                  compact
                  label="アイコンを変更"
                  previewUrl={avatarUrl}
                  onFileSelect={handleAvatarUpload}
                  uploading={avatarUploading}
                  progress={avatarProgress}
                />
              </div>

              <div className="space-y-2">
                <Label>ヘッダー画像</Label>
                <FileUpload
                  compact
                  label="ヘッダーを変更"
                  previewUrl={headerUrl}
                  onFileSelect={handleHeaderUpload}
                  uploading={headerUploading}
                  progress={headerProgress}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" /> デザイン設定
              </CardTitle>
              <CardDescription>
                ページの見た目をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-col gap-4">
                {message && (
                  <div className={`rounded-md p-3 text-sm animate-fadeIn ${
                    message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {message.text}
                  </div>
                )}

                <Button type="submit" className="w-full" isLoading={isSaving} disabled={!isDirty}>
                  変更を保存
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>

        <div className="space-y-6 md:col-span-1">
          <Card className="bg-slate-50 border-dashed">
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
              <CardDescription>
                実際の表示イメージ（簡易版）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`aspect-[9/16] w-full max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative font-${(formValues.fontFamily === 'SERIF' ? 'serif' : formValues.fontFamily === 'MONOSPACE' ? 'mono' : 'sans')}`}>
                {/* Header */}
                <div className="h-32 bg-slate-200 w-full relative">
                  {headerUrl && (
                     <img src={headerUrl} alt="Header" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>

                {/* Avatar */}
                <div className="absolute top-24 left-4 h-20 w-20 rounded-full bg-slate-100 border-4 border-white overflow-hidden">
                   {avatarUrl ? (
                     <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')}/>
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
                  <div className="aspect-square bg-slate-100 rounded"></div>
                  <div className="aspect-square bg-slate-100 rounded"></div>
                  <div className="aspect-square bg-slate-100 rounded"></div>
                  <div className="aspect-square bg-slate-100 rounded"></div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4">
                ※ 実際の公開ページとは表示が異なる場合があります
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
