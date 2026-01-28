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

// SNSアイコン (v2.1: サイズ拡大 24px → 48px)
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return <Twitter className="h-10 w-10 md:h-12 md:w-12" />;
    case 'instagram': return <Instagram className="h-10 w-10 md:h-12 md:w-12" />;
    case 'facebook': return <Facebook className="h-10 w-10 md:h-12 md:w-12" />;
    case 'youtube': return <Youtube className="h-10 w-10 md:h-12 md:w-12" />;
    default: return <LinkIcon className="h-10 w-10 md:h-12 md:w-12" />;
  }
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

  const { profile, artworks, socialLinks, posts, categories = [], tags = [] } = data;

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
    <div className="min-h-screen bg-paper-white text-slate-900 font-sans pb-40">

      {/* 1. Header & Intro Section (v2.1: 余白拡大、min-h-[40vh]) */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 sm:px-8 lg:px-12 min-h-[45vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Profile Identity (Magazine Cover Style) - v2.1: アバター・余白拡大 */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="font-outfit text-sm font-bold tracking-widest text-accent-secondary uppercase">
                  Based in Tokyo {/* TODO: Add location field */}
                </span>
                <SquigglyLine className="text-accent-primary mt-2 w-40" />
              </div>

              <div>
                <h1 className="font-outfit text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-4">
                  {profile.displayName}
                </h1>
                <p className="font-outfit text-xl md:text-2xl text-slate-400 font-medium ml-1">
                  @{username}
                </p>
              </div>

              {/* v2.1: アバター 160px → 240px (PC) / 180px (SP), rounded-3xl */}
              <div className="flex items-center gap-8 py-8">
                 <Avatar className="h-[180px] w-[180px] md:h-[240px] md:w-[240px] rounded-3xl border-4 border-slate-100 shadow-[12px_12px_0px_#1A1A1A] transition-transform hover:translate-x-[-4px] hover:translate-y-[-4px]">
                    <AvatarImage src={profile.avatarUrl || ''} alt={profile.displayName} className="rounded-3xl" />
                    <AvatarFallback className="text-6xl md:text-7xl rounded-3xl">{profile.displayName.charAt(0)}</AvatarFallback>
                 </Avatar>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg md:text-xl whitespace-pre-wrap max-w-lg">
                {profile.bio || '自己紹介はまだありません。'}
              </p>
            </div>

            {/* Social Links (Horizontal List) - v2.1: アイコン・ボタンサイズ拡大 */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 md:gap-5">
                {socialLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg" className="h-16 md:h-18 px-6 md:px-8 gap-3 md:gap-4 rounded-full border-2 hover:bg-accent-primary/20 hover:border-accent-primary hover:text-accent-primary hover:scale-105 transition-all duration-200">
                      {getPlatformIcon(link.platform)}
                      <span className="text-base md:text-lg font-bold">{link.platform}</span>
                    </Button>
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
                  header={<Badge variant="accent" className="w-fit mb-3 text-lg px-4 py-1">OPEN</Badge>}
                  className="md:col-span-1 bg-accent-primary/10 border-2 border-accent-primary/30"
                />
                
                {/* Latest Check / News */}
                <BentoGridItem 
                   title="Latest News"
                   description={posts && posts.length > 0 ? posts[0].title : "お知らせはありません"}
                   header={<div className="font-outfit font-bold text-3xl text-slate-300">NEWS</div>}
                   className="md:col-span-2 bg-slate-50 border-2 border-slate-100"
                />

                {/* Skills Block (Mockup for now as Skills entitiy is not fully linked yet) */}
                <div className="md:col-span-2 row-span-2 p-8 rounded-xl border-2 border-slate-100 bg-white shadow-none space-y-6">
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
                        selectedCategory === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-900'
                      }`}
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

      {/* 2. Works Section - v2.1: 余白拡大 */}
      <div className="max-w-7xl mx-auto px-6 mt-40 md:mt-48 sm:px-8 lg:px-12">
        <SectionTitle number="02" title="WORKS" className="mb-16" />
        
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
            <div className="text-center py-40 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400 text-xl md:text-2xl">作品が見つかりませんでした</p>
            </div>
        ) : (
            /* v2.1: 3カラム → 2カラム（PC）、1カラム（SP）、gap拡大、角丸拡大 */
            <MasonryGrid columns={2} mobileColumns={1} gap={32}>
                {filteredArtworks.map(artwork => (
                    <div key={artwork.id} className="group relative break-inside-avoid">
                        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-none hover:shadow-[12px_12px_0px_#1A1A1A] hover:translate-x-[-6px] hover:translate-y-[-6px] transition-all duration-300 cursor-pointer">
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
                            <h3 className="font-bold text-lg md:text-xl text-slate-900 truncate">{artwork.title}</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }) : ''}
                            </p>
                        </div>
                    </div>
                ))}
            </MasonryGrid>
        )}
      </div>

      {/* 3. Footer - v2.1: 余白拡大 */}
      <footer className="mt-48 md:mt-56 border-t border-slate-100 py-20 text-center">
         <p className="font-outfit text-slate-300 text-lg tracking-widest">DESIGNED WITH PICME</p>
      </footer>

    </div>
  );
}
