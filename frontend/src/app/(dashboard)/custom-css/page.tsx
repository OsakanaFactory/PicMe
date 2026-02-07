'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateCustomCss } from '@/lib/profile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Loader2, Save, Eye } from 'lucide-react';

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
    if (!isPro) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setCss(profile.customCss || '');
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isPro]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      await updateCustomCss(css);
      setMessage({ type: 'success', text: 'カスタムCSSを保存しました' });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'CSSの保存に失敗しました';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isPro) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">カスタムCSS</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <Code className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">カスタムCSSはPRO以上のプランで利用できます</p>
            <Button onClick={() => window.location.href = '/upgrade'}>プランをアップグレード</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const lineCount = css ? css.split('\n').length : 0;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">カスタムCSS</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPreview ? 'プレビューを閉じる' : 'プレビュー'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            保存
          </Button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="text-xs text-slate-400">
        {lineCount} / {maxLines} 行
        {' | '}
        @import, url(), expression() は使用できません
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* CSSエディタ */}
        <Card>
          <CardContent className="p-0">
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-[500px] p-4 font-mono text-sm bg-slate-950 text-green-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`/* 公開ページに適用されるカスタムCSS */\n\n.picme-profile h1 {\n  color: #ff6b6b;\n}\n\n.picme-works img {\n  border-radius: 16px;\n}`}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* ライブプレビュー */}
        {showPreview && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-slate-500 mb-3">プレビュー</h3>
              <div className="border rounded-lg p-4 min-h-[460px] bg-white">
                <style>{css}</style>
                <div className="picme-profile space-y-4">
                  <h1 className="text-2xl font-bold">表示名サンプル</h1>
                  <p className="text-slate-600">これはプレビュー用のサンプルテキストです。</p>
                  <div className="picme-works grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      作品1
                    </div>
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      作品2
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
