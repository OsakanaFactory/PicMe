'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { signup } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { dashFadeIn } from '@/lib/motion';

const signupSchema = z.object({
  username: z.string()
    .min(3, 'ユーザー名は3文字以上である必要があります')
    .max(20, 'ユーザー名は20文字以下である必要があります')
    .regex(/^[a-zA-Z0-9_]+$/, 'ユーザー名は半角英数字とアンダースコアのみ使用できます'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/[A-Za-z]/, '英字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...signupData } = data;
      const response = await signup(signupData);
      loginUser(response);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('登録に失敗しました。時間をおいて再度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white p-4 overflow-hidden">
      <FloatingShapes variant="auth" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
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

        <Card className="border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
          <CardHeader className="space-y-1 pb-4">
            <h1 className="font-outfit font-black text-2xl text-center tracking-tight">アカウント作成</h1>
            <p className="text-sm text-slate-500 text-center">
              クリエイターのためのポートフォリオ作成サービス
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">ユーザーID</Label>
                <Input
                  id="username"
                  placeholder="username"
                  {...register('username')}
                  error={errors.username?.message}
                />
                <p className="text-[10px] text-slate-500">
                  pic-me.net/username として公開されます
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード（確認）</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full font-bold" size="lg" isLoading={isLoading}>
                アカウント作成
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-slate-600">
              すでにアカウントをお持ちですか？{' '}
              <Link href="/login" className="font-medium text-slate-900 hover:underline">
                ログイン
              </Link>
            </div>
            <div className="text-[10px] text-center text-slate-400">
              アカウントを作成することで、<Link href="/terms" className="underline">利用規約</Link>と<Link href="/privacy" className="underline">プライバシーポリシー</Link>に同意したことになります。
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
