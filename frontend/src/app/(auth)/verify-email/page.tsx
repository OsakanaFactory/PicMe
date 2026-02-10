'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { verifyEmail } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { dashFadeIn } from '@/lib/motion';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('認証トークンが見つかりません');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('メールアドレスの認証が完了しました');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error?.message || '認証に失敗しました');
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="w-full max-w-md border-2 border-slate-900 shadow-[6px_6px_0px_#1A1A1A] bg-white">
      <CardHeader className="text-center pb-4">
        <h1 className="font-outfit font-black text-xl">メール認証</h1>
        <p className="text-sm text-slate-500 mt-2">メールアドレスの認証を行います</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
            <p className="text-slate-600">認証中...</p>
          </>
        )}
        {status === 'success' && (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle2 className="h-12 w-12 text-brand-green" />
            </motion.div>
            <p className="text-green-600 font-medium">{message}</p>
            <Link href="/login">
              <Button>ログインページへ</Button>
            </Link>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <XCircle className="h-12 w-12 text-red-500" />
            </motion.div>
            <p className="text-red-600 font-medium">{message}</p>
            <Link href="/login">
              <Button variant="outline">ログインページへ</Button>
            </Link>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
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
          <VerifyEmailContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
