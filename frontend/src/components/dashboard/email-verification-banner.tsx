'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resendVerification } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerification(user.email);
      setSent(true);
    } catch (error) {
      console.error('Failed to resend verification email', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-amber-400 hover:text-amber-600"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            メールアドレスが未認証です
          </p>
          <p className="text-sm text-amber-600 mt-1">
            {sent
              ? '認証メールを再送しました。メールをご確認ください。'
              : '登録時に送信された認証メールをご確認ください。'}
          </p>
          {!sent && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleResend}
              isLoading={isSending}
            >
              認証メールを再送する
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
