'use client';

import { useState } from 'react';
import { submitInquiry } from '@/lib/public';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Send, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  username: string;
}

export function ContactForm({ username }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('すべての項目を入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitInquiry(username, { name, email, subject, message });
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || '送信に失敗しました。時間をおいて再度お試しください。';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-2">送信完了</h3>
          <p className="text-green-600">お問い合わせありがとうございます。内容を確認後、ご連絡いたします。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">お問い合わせ</h3>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">お名前</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田太郎"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">件名</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="お仕事のご依頼について"
              maxLength={200}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">メッセージ</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="お問い合わせ内容をご記入ください"
              maxLength={2000}
              rows={5}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            送信する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
