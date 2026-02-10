'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { dashFadeIn } from '@/lib/motion';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(data);
      loginUser(response);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
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
            <h1 className="font-outfit font-black text-2xl text-center tracking-tight">ログイン</h1>
            <p className="text-sm text-slate-500 text-center">
              アカウント情報を入力してログインしてください
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">パスワード</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-slate-500 hover:text-slate-900 hover:underline"
                  >
                    パスワードをお忘れですか？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
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

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                ログイン
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" type="button" disabled>
                Google (Coming Soon)
              </Button>
              <Button variant="outline" type="button" disabled>
                GitHub (Coming Soon)
              </Button>
            </div>
            <div className="text-center text-sm text-slate-600">
              アカウントをお持ちでないですか？{' '}
              <Link href="/signup" className="font-medium text-slate-900 hover:underline">
                新規登録
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
