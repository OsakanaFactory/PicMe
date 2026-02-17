'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateCustomCss } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { dashFadeIn } from '@/lib/motion';
import { Code, Loader2, Save, Eye, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CustomCssPage() {
  const { user } = useAuth();
  const [css, setCss] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isPro = user?.planType === 'PRO' || user?.planType === 'STUDIO';
  const maxLines = user?.planType === 'STUDIO' ? 500 : 100;

  useEffect(() => {
    if (!isPro) { setIsLoading(false); return; }
    const loadProfile = async () => {
      try { const profile = await getProfile(); setCss(profile.customCss || ''); }
      catch (err) { console.error('Failed to load profile', err); }
      finally { setIsLoading(false); }
    };
    loadProfile();
  }, [isPro]);

  const handleSave = async () => {
    try {
      setIsSaving(true); setMessage(null);
      await updateCustomCss(css);
      setMessage({ type: 'success', text: 'カスタムCSSを保存しました' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'CSSの保存に失敗しました' });
    } finally { setIsSaving(false); }
  };

  if (!isPro) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Code} title="カスタムCSS" />
        <motion.div
          className="max-w-md mx-auto border border-slate-200 rounded-lg bg-white p-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-sky-600" />
          </div>
          <h2 className="font-outfit font-bold text-xl mb-2">Pro機能</h2>
          <p className="text-sm text-slate-500 mb-6">カスタムCSSはPRO以上のプランで利用できます</p>
          <Link href="/upgrade"><Button>プランをアップグレード</Button></Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Code} title="カスタムCSS" />
        <div className="flex items-center justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
      </div>
    );
  }

  const lineCount = css ? css.split('\n').length : 0;

  return (
    <div className="space-y-6">
      <PageHeader icon={Code} title="カスタムCSS">
        <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="h-4 w-4 mr-1" />
          {showPreview ? 'プレビューを閉じる' : 'プレビュー'}
        </Button>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          保存
        </Button>
      </PageHeader>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`px-4 py-3 rounded-lg text-sm border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs text-slate-400">
        {lineCount} / {maxLines} 行 | @import, url(), expression() は使用できません
      </div>

      <motion.div
        className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}
        variants={dashFadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* CSSエディタ */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full h-[500px] p-4 font-mono text-sm bg-slate-950 text-green-400 resize-none focus:outline-none"
            placeholder={`/* 公開ページに適用されるカスタムCSS */\n\n.picme-profile h1 {\n  color: #ff6b6b;\n}\n\n.picme-works img {\n  border-radius: 16px;\n}`}
            spellCheck={false}
          />
        </div>

        {/* ライブプレビュー */}
        {showPreview && (
          <motion.div
            className="border border-slate-200 rounded-lg bg-white overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-slate-500 mb-3">プレビュー</h3>
              <div className="border rounded-lg p-4 min-h-[460px] bg-white">
                <style>{css}</style>
                <div className="picme-profile space-y-4">
                  <h1 className="text-2xl font-bold">表示名サンプル</h1>
                  <p className="text-slate-600">これはプレビュー用のサンプルテキストです。</p>
                  <div className="picme-works grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">作品1</div>
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">作品2</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
