'use client';

import { useState, useEffect } from 'react';
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

// SNSアイコン
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return <Twitter className="h-5 w-5" />;
    case 'instagram': return <Instagram className="h-5 w-5" />;
    case 'facebook': return <Facebook className="h-5 w-5" />;
    case 'youtube': return <Youtube className="h-5 w-5" />;
    default: return <LinkIcon className="h-5 w-5" />;
  }
};

export default function PublicPage({ params }: { params: { username: string } }) {
  const [data, setData] = useState<PublicPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pageData = await getPublicPage(params.username);
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
  }, [params.username]);

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
    <div className="min-h-screen bg-paper-white text-slate-900 font-sans pb-20">
      
      {/* 1. Header & Intro Section */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Profile Identity (Magazine Cover Style) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="font-outfit text-sm font-bold tracking-widest text-brand-coral uppercase">
                  Based in Tokyo {/* TODO: Add location field */}
                </span>
                <SquigglyLine className="text-brand-green mt-1 w-24" />
              </div>
              
              <div>
                <h1 className="font-outfit text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-2">
                  {profile.displayName}
                </h1>
                <p className="font-outfit text-xl text-slate-400 font-medium ml-1">
                  @{params.username}
                </p>
              </div>

              <div className="flex items-center gap-4 py-4">
                 <Avatar className="h-32 w-32 rounded-xl border-4 border-slate-100 shadow-[4px_4px_0px_#000]">
                    <AvatarImage src={profile.avatarUrl || ''} alt={profile.displayName} />
                    <AvatarFallback className="text-4xl">{profile.displayName.charAt(0)}</AvatarFallback>
                 </Avatar>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                {profile.bio || '自己紹介はまだありません。'}
              </p>
            </div>

            {/* Social Links (Horizontal List) */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(link => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 rounded-full border-2 hover:bg-brand-green/20 hover:border-brand-green hover:text-brand-green transition-all">
                      {getPlatformIcon(link.platform)}
                      {link.platform}
                    </Button>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Bento Grid (Status / Skills / Info) */}
          <div className="lg:col-span-7">
             <BentoGrid className="md:auto-rows-[10rem]">
                {/* Status Block */}
                <BentoGridItem
                  title="Current Status"
                  description="お仕事募集中！DMにてご連絡ください。" /* TODO: Dynamic Status */
                  header={<Badge variant="accent" className="w-fit mb-2">OPEN</Badge>}
                  className="md:col-span-1 bg-brand-green/20 border-2 border-brand-green/30"
                />
                
                {/* Latest Check / News */}
                <BentoGridItem 
                   title="Latest News"
                   description={posts && posts.length > 0 ? posts[0].title : "お知らせはありません"}
                   header={<div className="font-outfit font-bold text-2xl text-slate-300">NEWS</div>}
                   className="md:col-span-2 bg-slate-50 border-2 border-slate-100"
                />

                {/* Skills Block (Mockup for now as Skills entitiy is not fully linked yet) */}
                <div className="md:col-span-2 row-span-2 p-6 rounded-xl border-2 border-slate-100 bg-white shadow-none space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="font-outfit text-xl font-bold">SKILL SET</h3>
                      <Badge variant="outline">Verified</Badge>
                   </div>
                   <div className="space-y-1">
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
                      className={`md:col-span-1 p-4 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${
                        selectedCategory === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-900'
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                   >
                      <div className="h-full flex flex-col justify-between">
                         <div className="font-outfit text-4xl font-bold opacity-20">#</div>
                         <div className="font-bold text-lg text-right">{cat.name}</div>
                      </div>
                   </div>
                ))}
             </BentoGrid>
          </div>

        </div>
      </div>

      {/* 2. Works Section */}
      <div className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8">
        <SectionTitle number="02" title="WORKS" className="mb-8" />
        
        {/* Chips for Tags */}
        {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                    <Badge 
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'coral' : 'secondary'}
                        className="cursor-pointer px-4 py-1 text-sm bg-white border border-slate-200"
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
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400">作品が見つかりませんでした</p>
            </div>
        ) : (
            <MasonryGrid columns={3} gap={24}>
                {filteredArtworks.map(artwork => (
                    <div key={artwork.id} className="group relative break-inside-avoid mb-6">
                        <div className="relative overflow-hidden rounded-lg border-2 border-slate-100 bg-white shadow-none hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
                            <img 
                                src={artwork.imageUrl} 
                                alt={artwork.title}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-bold text-lg mb-1">{artwork.title}</h3>
                                    {artwork.description && (
                                        <p className="text-sm text-slate-200 line-clamp-2">{artwork.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </MasonryGrid>
        )}
      </div>

      {/* 3. Footer */}
      <footer className="mt-32 border-t border-slate-100 py-12 text-center">
         <p className="font-outfit text-slate-300 text-sm">DESIGNED WITH PICME</p>
      </footer>

    </div>
  );
}
