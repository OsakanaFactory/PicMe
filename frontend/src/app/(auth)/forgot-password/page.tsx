'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { CheckCircle2 } from 'lucide-react';
import { dashFadeIn } from '@/lib/motion';

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword(data.email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'エラーが発生しました');
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

        <AnimatePresence mode="wait">
          {isSent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                    className="mx-auto mb-3"
                  >
                    <CheckCircle2 className="h-12 w-12 text-brand-green" />
                  </motion.div>
                  <h1 className="font-outfit font-black text-xl">メールを送信しました</h1>
                  <p className="text-sm text-slate-500 mt-2">
                    パスワードリセットのリンクをメールで送信しました。メールをご確認ください。
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/login">
                    <Button variant="outline">ログインページに戻る</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="form">
              <Card className="border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
                <CardHeader className="text-center pb-4">
                  <h1 className="font-outfit font-black text-xl">パスワードをお忘れですか？</h1>
                  <p className="text-sm text-slate-500 mt-2">
                    登録済みのメールアドレスを入力してください。パスワードリセットのリンクをお送りします。
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
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                      リセットリンクを送信
                    </Button>
                    <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
                      ログインページに戻る
                    </Link>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
