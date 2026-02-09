'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { getPublicPage, PublicPageData } from '@/lib/public';
import { Loader2, Link as LinkIcon, Twitter, Instagram, Facebook, Youtube, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/ui/section-title';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import { SkillBar } from '@/components/ui/skill-bar';
import { FreeUserAd } from '@/components/ads';
import { ContactForm } from '@/components/public/contact-form';

// SNSアイコン (v2.1.4: 大型アイコンデザイン)
const getPlatformIcon = (platform: string) => {
  const iconClass = "h-8 w-8 md:h-10 md:w-10";
  switch (platform.toLowerCase()) {
    case 'twitter': return <Twitter className={iconClass} />;
    case 'x': return <Twitter className={iconClass} />;
    case 'instagram': return <Instagram className={iconClass} />;
    case 'facebook': return <Facebook className={iconClass} />;
    case 'youtube': return <Youtube className={iconClass} />;
    default: return <LinkIcon className={iconClass} />;
  }
};

// SNSプラットフォームごとの背景色
const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter':
    case 'x': return 'bg-black hover:bg-gray-800 text-white';
    case 'instagram': return 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white';
    case 'facebook': return 'bg-blue-600 hover:bg-blue-700 text-white';
    case 'youtube': return 'bg-red-600 hover:bg-red-700 text-white';
    case 'pixiv': return 'bg-[#0096fa] hover:bg-[#0080d8] text-white';
    default: return 'bg-slate-800 hover:bg-slate-700 text-white';
  }
};

// テーマ設定のマッピング
const themeStyles = {
  LIGHT: { bg: 'bg-white', text: 'text-slate-900', subtext: 'text-slate-500', mutedBg: 'bg-slate-50', mutedBorder: 'border-slate-100', cardBg: 'bg-white' },
  DARK: { bg: 'bg-slate-900', text: 'text-white', subtext: 'text-slate-400', mutedBg: 'bg-slate-800', mutedBorder: 'border-slate-700', cardBg: 'bg-slate-800' },
  WARM: { bg: 'bg-amber-50', text: 'text-amber-950', subtext: 'text-amber-700', mutedBg: 'bg-amber-100/50', mutedBorder: 'border-amber-200', cardBg: 'bg-white' },
  COOL: { bg: 'bg-sky-50', text: 'text-sky-950', subtext: 'text-sky-700', mutedBg: 'bg-sky-100/50', mutedBorder: 'border-sky-200', cardBg: 'bg-white' },
} as const;

// フォントマッピング
const fontFamilyMap: Record<string, string> = {
  'default': 'system-ui, sans-serif',
  'noto-sans-jp': '"Noto Sans JP", sans-serif',
  'zen-kaku-gothic': '"Zen Kaku Gothic New", sans-serif',
  'm-plus-1p': '"M PLUS 1p", sans-serif',
};

// Google Fontsのimport URL
const fontImportMap: Record<string, string> = {
  'noto-sans-jp': 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap',
  'zen-kaku-gothic': 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap',
  'm-plus-1p': 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700;900&display=swap',
};

// レイアウト→カラム数マッピング
const layoutColumnsMap: Record<string, number> = {
  'STANDARD': 2,
  'GRID_3': 3,
  'GRID_4': 4,
  'MASONRY': 2,
};

export default function PublicPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [data, setData] = useState<PublicPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pageData = await getPublicPage(username);
        setData(pageData);
      } catch (err: any) {
        console.error('Failed to load public page', err);
        if (err.response && err.response.status === 404) {
           setError('USER_NOT_FOUND');
        } else {
           setError('UNKNOWN_ERROR');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-white">
        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error === 'USER_NOT_FOUND') {
    notFound(); 
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-paper-white">
        <h1 className="text-2xl font-bold text-slate-900">エラーが発生しました</h1>
        <p className="text-slate-500">ページの読み込みに失敗しました。</p>
        <Button onClick={() => window.location.reload()}>再読み込み</Button>
      </div>
    );
  }

  const { profile, artworks, socialLinks, posts, categories = [], tags = [], contactFormEnabled, customCss } = data;
  const userPlanType = profile.planType || 'FREE';

  // テーマ設定の適用
  const themeKey = (profile.theme as keyof typeof themeStyles) || 'LIGHT';
  const theme = themeStyles[themeKey] || themeStyles.LIGHT;
  const fontFamily = fontFamilyMap[profile.fontFamily || 'default'] || fontFamilyMap['default'];
  const fontImportUrl = fontImportMap[profile.fontFamily || ''];
  const colorPrimary = profile.colorPrimary || '#3B82F6';
  const colorAccent = profile.colorAccent || '#10B981';
  const galleryColumns = layoutColumnsMap[profile.layout || 'STANDARD'] || 2;

  // フィルタリング処理
  const filteredArtworks = artworks.filter(artwork => {
      if (selectedCategory !== null && artwork.categoryId !== selectedCategory) return false;
      if (selectedTags.length > 0) {
          const artworkTagIds = artwork.tagIds || [];
          if (!selectedTags.some(tagId => artworkTagIds.includes(tagId))) return false;
      }
      return true;
  });

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-40`} style={{ fontFamily }}>

      {/* Google Fonts読み込み */}
      {fontImportUrl && <style dangerouslySetInnerHTML={{ __html: `@import url('${fontImportUrl}');` }} />}

      {/* テーマカラーCSS変数 */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --color-primary: ${colorPrimary}; --color-accent: ${colorAccent}; }
      ` }} />

      {/* カスタムCSS適用 */}
      {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}

      {/* 1. Header & Intro Section (v2.1: 余白拡大、min-h-[40vh]) */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 sm:px-8 lg:px-12 min-h-[45vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Profile Identity (Magazine Cover Style) - v2.1: アバター・余白拡大 */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="font-outfit text-sm font-bold tracking-widest uppercase" style={{ color: colorAccent }}>
                  Based in Tokyo {/* TODO: Add location field */}
                </span>
                <SquigglyLine className="mt-2 w-40" style={{ color: colorPrimary }} />
              </div>

              <div>
                <h1 className="font-outfit text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-4">
                  {profile.displayName}
                </h1>
                <p className={`font-outfit text-xl md:text-2xl ${theme.subtext} font-medium ml-1`}>
                  @{username}
                </p>
              </div>

              {/* v2.1.4: アバター - ビューポート対応で画面に収まるサイズ */}
              <div className="flex items-center gap-6 py-6 md:py-8">
                 <Avatar className="h-[min(45vw,220px)] w-[min(45vw,220px)] md:h-[min(30vw,280px)] md:w-[min(30vw,280px)] lg:h-[min(25vw,320px)] lg:w-[min(25vw,320px)] rounded-[1.5rem] md:rounded-[2rem] border-4 border-white shadow-[12px_12px_0px_#1A1A1A] md:shadow-[16px_16px_0px_#1A1A1A] transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[18px_18px_0px_#1A1A1A]">
                    <AvatarImage src={profile.avatarUrl || ''} alt={profile.displayName} className="rounded-[1.5rem] md:rounded-[2rem]" />
                    <AvatarFallback className="text-5xl md:text-7xl lg:text-8xl rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-brand-green to-brand-coral">{profile.displayName.charAt(0)}</AvatarFallback>
                 </Avatar>
              </div>

              <p className={`${theme.subtext} leading-relaxed text-lg md:text-xl whitespace-pre-wrap max-w-lg`}>
                {profile.bio || '自己紹介はまだありません。'}
              </p>
            </div>

            {/* Social Links - v2.1.4: 大型カラフルアイコンデザイン */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 md:gap-5">
                {socialLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className={`
                      w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                      rounded-2xl md:rounded-3xl
                      flex items-center justify-center
                      ${getPlatformColor(link.platform)}
                      shadow-lg hover:shadow-xl
                      transform hover:scale-110 hover:-rotate-3
                      transition-all duration-300
                      border-2 border-white/20
                    `}>
                      {getPlatformIcon(link.platform)}
                    </div>
                    <p className="text-center text-xs md:text-sm font-medium text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {link.platform}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Bento Grid (Status / Skills / Info) */}
          <div className="lg:col-span-7">
             <BentoGrid className="md:auto-rows-[12rem] gap-6">
                {/* Status Block */}
                <BentoGridItem
                  title="Current Status"
                  description="お仕事募集中！DMにてご連絡ください。" /* TODO: Dynamic Status */
                  header={<Badge variant="accent" className="w-fit mb-3 text-lg px-4 py-1" style={{ backgroundColor: colorPrimary, color: '#fff' }}>OPEN</Badge>}
                  className="md:col-span-1 border-2"
                  style={{ backgroundColor: `${colorPrimary}15`, borderColor: `${colorPrimary}40` }}
                />
                
                {/* Latest Check / News */}
                <BentoGridItem
                   title="Latest News"
                   description={posts && posts.length > 0 ? posts[0].title : "お知らせはありません"}
                   header={<div className={`font-outfit font-bold text-3xl ${theme.subtext} opacity-50`}>NEWS</div>}
                   className={`md:col-span-2 ${theme.mutedBg} border-2 ${theme.mutedBorder}`}
                />

                {/* Skills Block (Mockup for now as Skills entitiy is not fully linked yet) */}
                <div className={`md:col-span-2 row-span-2 p-8 rounded-xl border-2 ${theme.mutedBorder} ${theme.cardBg} shadow-none space-y-6`}>
                   <div className="flex items-center justify-between">
                      <h3 className="font-outfit text-2xl font-bold">SKILL SET</h3>
                      <Badge variant="outline" className="text-base px-3">Verified</Badge>
                   </div>
                   <div className="space-y-3">
                      <SkillBar name="Photoshop" level={5} />
                      <SkillBar name="Illustrator" level={4} />
                      <SkillBar name="Figma" level={5} />
                      <SkillBar name="Blender" level={3} />
                   </div>
                </div>

                {/* Categories as Bento Blocks */}
                {categories.map(cat => (
                   <div 
                      key={cat.id} 
                      className={`md:col-span-1 p-6 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-lg ${
                        selectedCategory === cat.id ? 'text-white border-transparent' : `${theme.cardBg} ${theme.mutedBorder} hover:border-current`
                      }`}
                      style={selectedCategory === cat.id ? { backgroundColor: colorPrimary } : undefined}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                   >
                      <div className="h-full flex flex-col justify-between">
                         <div className="font-outfit text-5xl font-bold opacity-20">#</div>
                         <div className="font-bold text-xl text-right">{cat.name}</div>
                      </div>
                   </div>
                ))}
             </BentoGrid>
          </div>

        </div>
      </div>

      {/* Ad: ヘッダー下広告 */}
      <FreeUserAd planType={userPlanType} slot="header" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 my-8" />

      {/* 2. Works Section - v2.1: 余白拡大 */}
      <div className="max-w-7xl mx-auto px-6 mt-40 md:mt-48 sm:px-8 lg:px-12">
        <SectionTitle number="02" title="WORKS" className="mb-16" />

        {/* Ad: ギャラリータイトル下広告 */}
        <FreeUserAd planType={userPlanType} slot="gallery" className="mb-12" />
        
        {/* Chips for Tags - v2.1: サイズ拡大 */}
        {tags.length > 0 && (
            <div className="flex flex-wrap gap-3 md:gap-4 mb-12 md:mb-16">
                {tags.map(tag => (
                    <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'coral' : 'secondary'}
                        className="cursor-pointer px-5 md:px-6 py-2 md:py-2.5 text-base md:text-lg bg-white border-2 border-slate-200 hover:border-accent-secondary hover:scale-105 transition-all duration-200"
                        onClick={() => {
                            if (selectedTags.includes(tag.id)) {
                                setSelectedTags(selectedTags.filter(id => id !== tag.id));
                            } else {
                                setSelectedTags([...selectedTags, tag.id]);
                            }
                        }}
                    >
                        #{tag.name}
                    </Badge>
                ))}
            </div>
        )}

        {filteredArtworks.length === 0 ? (
            <div className={`text-center py-40 border-2 border-dashed ${theme.mutedBorder} rounded-2xl`}>
                <p className={`${theme.subtext} text-xl md:text-2xl`}>作品が見つかりませんでした</p>
            </div>
        ) : (
            <MasonryGrid columns={galleryColumns} mobileColumns={1} gap={32}>
                {filteredArtworks.map(artwork => (
                    <div key={artwork.id} className="group relative break-inside-avoid">
                        <div className={`relative overflow-hidden rounded-2xl border-2 ${theme.mutedBorder} ${theme.cardBg} shadow-none hover:shadow-lg hover:translate-x-[-6px] hover:translate-y-[-6px] transition-all duration-300 cursor-pointer`}>
                            {/* v2.1: 画像を大きく表示、scale効果追加 */}
                            <div className="overflow-hidden">
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            {/* v2.1: ホバーオーバーレイ改善 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 backdrop-blur-[1px]">
                                <div className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold font-outfit text-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl mb-6">
                                  ▶ VIEW WORK
                                </div>
                                <div className="text-white text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-bold text-xl md:text-2xl mb-3 drop-shadow-lg">{artwork.title}</h3>
                                    {artwork.description && (
                                        <p className="text-sm md:text-base text-slate-100 line-clamp-2 px-4 drop-shadow">{artwork.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* v2.1: カード下にタイトル表示 */}
                        <div className="mt-4 px-1">
                            <h3 className={`font-bold text-lg md:text-xl ${theme.text} truncate`}>{artwork.title}</h3>
                            <p className={`text-sm ${theme.subtext} mt-1`}>
                                {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }) : ''}
                            </p>
                        </div>
                    </div>
                ))}
            </MasonryGrid>
        )}
      </div>

      {/* Ad: フッター上広告 */}
      <FreeUserAd planType={userPlanType} slot="profile" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-20" />

      {/* 問い合わせフォーム（PRO/STUDIO + contactFormEnabled の場合） */}
      {contactFormEnabled && (
        <div className="max-w-2xl mx-auto px-6 mt-20 sm:px-8 lg:px-12">
          <ContactForm username={username} />
        </div>
      )}

      {/* 3. Footer - v2.1: 余白拡大 */}
      <footer className={`mt-48 md:mt-56 border-t ${theme.mutedBorder} py-20 text-center`}>
         <p className={`font-outfit ${theme.subtext} opacity-50 text-lg tracking-widest`}>DESIGNED WITH PICME</p>
      </footer>

    </div>
  );
}
