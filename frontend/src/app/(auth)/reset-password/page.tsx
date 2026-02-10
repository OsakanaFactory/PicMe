'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { resetPassword } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { dashFadeIn } from '@/lib/motion';

const schema = z.object({
  newPassword: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setError('リセットトークンが見つかりません');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(token, data.newPassword);
      setIsComplete(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
        <CardHeader className="text-center">
          <h1 className="font-outfit font-black text-xl">エラー</h1>
          <p className="text-sm text-slate-500 mt-2">リセットトークンが見つかりません</p>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/forgot-password">
            <Button variant="outline">パスワードリセットを再リクエスト</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="mx-auto mb-3"
            >
              <CheckCircle2 className="h-12 w-12 text-brand-green" />
            </motion.div>
            <h1 className="font-outfit font-black text-xl">パスワードを変更しました</h1>
            <p className="text-sm text-slate-500 mt-2">
              新しいパスワードでログインしてください。
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button>ログインページへ</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-md border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
      <CardHeader className="text-center pb-4">
        <h1 className="font-outfit font-black text-xl">新しいパスワードを設定</h1>
        <p className="text-sm text-slate-500 mt-2">
          新しいパスワードを入力してください。
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新しいパスワード</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="8文字以上"
              {...register('newPassword')}
              error={errors.newPassword?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード（確認）</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="もう一度入力"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            パスワードを変更
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white p-4 overflow-hidden">
      <FloatingShapes variant="auth" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="text-center mb-8"
          variants={dashFadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="font-outfit font-black text-3xl tracking-tight">PicMe</span>
            <SquigglyLine className="w-16 h-4 text-brand-green -ml-1" />
          </Link>
        </motion.div>

        <Suspense fallback={
          <Card className="w-full max-w-md border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
              <p className="text-slate-600">読み込み中...</p>
            </CardContent>
          </Card>
        }>
          <ResetPasswordContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
