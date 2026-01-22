'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile, Profile } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Palette, Type, LayoutGrid, Check } from 'lucide-react';

// テーマ定義
const themes = [
  { id: 'LIGHT', name: 'ライト', description: '明るい白基調のテーマ', preview: 'bg-white border-slate-200' },
  { id: 'DARK', name: 'ダーク', description: 'ダークモードのテーマ', preview: 'bg-slate-900 border-slate-700' },
  { id: 'WARM', name: 'ウォーム', description: '温かみのあるベージュ系', preview: 'bg-amber-50 border-amber-200' },
  { id: 'COOL', name: 'クール', description: 'クールなブルー系', preview: 'bg-sky-50 border-sky-200' },
];

// レイアウト定義
const layouts = [
  { id: 'STANDARD', name: 'スタンダード', description: '2列のグリッドレイアウト' },
  { id: 'GRID_3', name: '3列グリッド', description: '3列のグリッドレイアウト' },
  { id: 'GRID_4', name: '4列グリッド', description: '4列のグリッドレイアウト' },
  { id: 'MASONRY', name: 'メイソンリー', description: '高さの異なるカード配置' },
];

// フォント定義
const fonts = [
  { id: 'default', name: 'デフォルト', family: 'system-ui, sans-serif' },
  { id: 'noto-sans-jp', name: 'Noto Sans JP', family: '"Noto Sans JP", sans-serif' },
  { id: 'zen-kaku-gothic', name: 'Zen Kaku Gothic', family: '"Zen Kaku Gothic New", sans-serif' },
  { id: 'm-plus-1p', name: 'M PLUS 1p', family: '"M PLUS 1p", sans-serif' },
];

// プリセットカラー
const presetColors = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

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
      await updateProfile({
        theme: selectedTheme,
        layout: selectedLayout,
        fontFamily: selectedFont,
        colorPrimary: colorPrimary,
        colorAccent: colorAccent,
      });
      alert('テーマ設定を保存しました');
    } catch (error: any) {
      console.error('Failed to save theme', error);
      const msg = error.response?.data?.message || 'テーマの保存に失敗しました';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">テーマ設定</h1>
          <p className="text-slate-500">
            公開ページのデザインをカスタマイズします
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          変更を保存
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* テーマ選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              テーマ
            </CardTitle>
            <CardDescription>
              ベースとなるテーマを選択します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-16 rounded-md mb-3 ${theme.preview} border`}></div>
                  <p className="font-medium text-sm">{theme.name}</p>
                  <p className="text-xs text-slate-500">{theme.description}</p>
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* カラー設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              カラー
            </CardTitle>
            <CardDescription>
              アクセントカラーを設定します（Pro以上）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">プライマリーカラー</Label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorPrimary(color)}
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                        colorPrimary === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={colorPrimary}
                  onChange={(e) => setColorPrimary(e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer"
                />
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
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                        colorAccent === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={colorAccent}
                  onChange={(e) => setColorAccent(e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* レイアウト設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              レイアウト
            </CardTitle>
            <CardDescription>
              ギャラリーのレイアウトを選択します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedLayout === layout.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium">{layout.name}</p>
                  <p className="text-sm text-slate-500">{layout.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* フォント設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              フォント
            </CardTitle>
            <CardDescription>
              テキストのフォントを選択します（Pro以上）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger>
                <SelectValue placeholder="フォントを選択" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    <span style={{ fontFamily: font.family }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p
                className="text-lg"
                style={{ fontFamily: fonts.find(f => f.id === selectedFont)?.family }}
              >
                サンプルテキスト / Sample Text
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* プレビュー */}
      <Card>
        <CardHeader>
          <CardTitle>プレビュー</CardTitle>
          <CardDescription>
            実際の公開ページでの見え方を確認できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`p-6 rounded-lg border ${
              selectedTheme === 'DARK' ? 'bg-slate-900 text-white border-slate-700' :
              selectedTheme === 'WARM' ? 'bg-amber-50 border-amber-200' :
              selectedTheme === 'COOL' ? 'bg-sky-50 border-sky-200' :
              'bg-white border-slate-200'
            }`}
            style={{ fontFamily: fonts.find(f => f.id === selectedFont)?.family }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="h-16 w-16 rounded-full"
                style={{ backgroundColor: colorPrimary }}
              />
              <div>
                <h3 className="text-xl font-bold">サンプルユーザー</h3>
                <p className={`text-sm ${selectedTheme === 'DARK' ? 'text-slate-400' : 'text-slate-500'}`}>
                  @sample_user
                </p>
              </div>
            </div>
            <p className={`mb-4 ${selectedTheme === 'DARK' ? 'text-slate-300' : 'text-slate-600'}`}>
              これはプレビューのサンプルテキストです。実際の公開ページではここにプロフィールの自己紹介が表示されます。
            </p>
            <div
              className={`grid gap-4 ${
                selectedLayout === 'GRID_3' ? 'grid-cols-3' :
                selectedLayout === 'GRID_4' ? 'grid-cols-4' :
                'grid-cols-2'
              }`}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg ${
                    selectedTheme === 'DARK' ? 'bg-slate-800' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: colorAccent }}
            >
              サンプルボタン
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
