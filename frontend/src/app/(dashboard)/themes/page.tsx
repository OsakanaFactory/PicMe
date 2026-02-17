'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProfile, updateProfile, Profile } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { dashStaggerContainer, dashStaggerItem, dashFadeIn } from '@/lib/motion';
import { Loader2, Palette, Type, LayoutGrid, Check } from 'lucide-react';

const themes = [
  { id: 'LIGHT', name: 'ライト', description: '明るい白基調のテーマ', bg: '#ffffff', accent: '#D9F99D', card: '#f1f5f9' },
  { id: 'DARK', name: 'ダーク', description: 'ダークモードのテーマ', bg: '#0f172a', accent: '#D9F99D', card: '#1e293b' },
  { id: 'WARM', name: 'ウォーム', description: '温かみのあるベージュ系', bg: '#fffbeb', accent: '#fbbf24', card: '#fef3c7' },
  { id: 'COOL', name: 'クール', description: 'クールなブルー系', bg: '#f0f9ff', accent: '#38bdf8', card: '#e0f2fe' },
];

const layouts = [
  { id: 'STANDARD', name: 'スタンダード', description: '2列のグリッドレイアウト' },
  { id: 'GRID_3', name: '3列グリッド', description: '3列のグリッドレイアウト' },
  { id: 'GRID_4', name: '4列グリッド', description: '4列のグリッドレイアウト' },
  { id: 'MASONRY', name: 'メイソンリー', description: '高さの異なるカード配置' },
];

const fonts = [
  { id: 'default', name: 'デフォルト', family: 'system-ui, sans-serif' },
  { id: 'noto-sans-jp', name: 'Noto Sans JP', family: '"Noto Sans JP", sans-serif' },
  { id: 'zen-kaku-gothic', name: 'Zen Kaku Gothic', family: '"Zen Kaku Gothic New", sans-serif' },
  { id: 'm-plus-1p', name: 'M PLUS 1p', family: '"M PLUS 1p", sans-serif' },
];

const presetColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function ThemesPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('LIGHT');
  const [selectedLayout, setSelectedLayout] = useState('STANDARD');
  const [selectedFont, setSelectedFont] = useState('default');
  const [colorPrimary, setColorPrimary] = useState('#3B82F6');
  const [colorAccent, setColorAccent] = useState('#10B981');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setSelectedTheme(data.theme || 'LIGHT');
        setSelectedLayout(data.layout || 'STANDARD');
        setSelectedFont(data.fontFamily || 'default');
        setColorPrimary(data.colorPrimary || '#3B82F6');
        setColorAccent(data.colorAccent || '#10B981');
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateProfile({ theme: selectedTheme, layout: selectedLayout, fontFamily: selectedFont, colorPrimary, colorAccent });
      alert('テーマ設定を保存しました');
    } catch (error: any) {
      alert(error.response?.data?.message || 'テーマの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={Palette} title="テーマ設定" description="公開ページのデザインをカスタマイズします">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          変更を保存
        </Button>
      </PageHeader>

      <motion.div className="grid gap-6 lg:grid-cols-2" variants={dashStaggerContainer} initial="hidden" animate="visible">
        {/* テーマ選択 */}
        <motion.div className="bg-white border border-slate-200 rounded-lg overflow-hidden" variants={dashStaggerItem}>
          <div className="p-6">
            <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-1"><Palette className="h-5 w-5" /> テーマ</h3>
            <p className="text-sm text-slate-500 mb-4">ベースとなるテーマを選択します</p>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`relative p-4 rounded-lg border text-left transition-all ${
                    selectedTheme === theme.id ? 'border-slate-900 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="h-12 rounded-md mb-3 border" style={{ backgroundColor: theme.bg }}>
                    <div className="flex gap-1 p-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                      <div className="flex-1 h-3 rounded" style={{ backgroundColor: theme.card }} />
                    </div>
                  </div>
                  <p className="font-medium text-sm">{theme.name}</p>
                  <p className="text-xs text-slate-500">{theme.description}</p>
                  {selectedTheme === theme.id && (
                    <motion.div
                      className="absolute top-2 right-2 h-5 w-5 bg-slate-900 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* カラー設定 */}
        <motion.div className="bg-white border border-slate-200 rounded-lg overflow-hidden" variants={dashStaggerItem}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-1"><Palette className="h-5 w-5" /> カラー</h3>
              <p className="text-sm text-slate-500 mb-4">アクセントカラーを設定します（Pro以上）</p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">プライマリーカラー</Label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorPrimary(color)}
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${colorPrimary === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input type="color" value={colorPrimary} onChange={(e) => setColorPrimary(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">アクセントカラー</Label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorAccent(color)}
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${colorAccent === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input type="color" value={colorAccent} onChange={(e) => setColorAccent(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* レイアウト設定 */}
        <motion.div className="bg-white border border-slate-200 rounded-lg overflow-hidden" variants={dashStaggerItem}>
          <div className="p-6">
            <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-1"><LayoutGrid className="h-5 w-5" /> レイアウト</h3>
            <p className="text-sm text-slate-500 mb-4">ギャラリーのレイアウトを選択します</p>
            <div className="space-y-3">
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedLayout === layout.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium">{layout.name}</p>
                  <p className="text-sm text-slate-500">{layout.description}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* フォント設定 */}
        <motion.div className="bg-white border border-slate-200 rounded-lg overflow-hidden" variants={dashStaggerItem}>
          <div className="p-6">
            <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-1"><Type className="h-5 w-5" /> フォント</h3>
            <p className="text-sm text-slate-500 mb-4">テキストのフォントを選択します（Pro以上）</p>
            <Select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
              {fonts.map((font) => <option key={font.id} value={font.id}>{font.name}</option>)}
            </Select>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-lg" style={{ fontFamily: fonts.find(f => f.id === selectedFont)?.family }}>
                サンプルテキスト / Sample Text
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* プレビュー */}
      <motion.div className="bg-white border border-slate-200 rounded-lg overflow-hidden" variants={dashFadeIn} initial="hidden" animate="visible" custom={0.3}>
        <div className="p-6">
          <h3 className="font-outfit font-bold text-lg mb-1">プレビュー</h3>
          <p className="text-sm text-slate-500 mb-4">実際の公開ページでの見え方を確認できます</p>
          <motion.div
            className="p-6 rounded-lg border"
            animate={{
              backgroundColor: themes.find(t => t.id === selectedTheme)?.bg || '#fff',
              borderColor: selectedTheme === 'DARK' ? '#334155' : '#e2e8f0',
            }}
            transition={{ duration: 0.4 }}
            style={{ fontFamily: fonts.find(f => f.id === selectedFont)?.family }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full" style={{ backgroundColor: colorPrimary }} />
              <div>
                <h3 className={`text-xl font-bold ${selectedTheme === 'DARK' ? 'text-white' : 'text-slate-900'}`}>サンプルユーザー</h3>
                <p className={`text-sm ${selectedTheme === 'DARK' ? 'text-slate-400' : 'text-slate-500'}`}>@sample_user</p>
              </div>
            </div>
            <p className={`mb-4 ${selectedTheme === 'DARK' ? 'text-slate-300' : 'text-slate-600'}`}>
              これはプレビューのサンプルテキストです。
            </p>
            <div className={`grid gap-4 ${selectedLayout === 'GRID_3' ? 'grid-cols-3' : selectedLayout === 'GRID_4' ? 'grid-cols-4' : 'grid-cols-2'}`}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-lg ${selectedTheme === 'DARK' ? 'bg-slate-800' : 'bg-slate-100'}`} />
              ))}
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: colorAccent }}>
              サンプルボタン
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
