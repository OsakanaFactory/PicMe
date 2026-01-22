'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getPublicPage, PublicPageData } from '@/lib/public';
import { Loader2, Link as LinkIcon, Twitter, Instagram, Facebook, Youtube, MapPin, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// SNSアイコンのマッピング (SocialLinksPageと同じロジックが望ましいが簡易的に再定義)
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error === 'USER_NOT_FOUND') {
    notFound(); 
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">エラーが発生しました</h1>
        <p className="text-slate-500">ページの読み込みに失敗しました。</p>
        <Button onClick={() => window.location.reload()}>再読み込み</Button>
      </div>
    );
  }

  const { profile, artworks, socialLinks, posts } = data;

  // テーマに応じたスタイル設定
  const getThemeStyles = () => {
    switch (profile.theme) {
      case 'DARK':
        return { bg: 'bg-slate-950', card: 'bg-slate-800 border-slate-700', text: 'text-white', subtext: 'text-slate-400' };
      case 'WARM':
        return { bg: 'bg-amber-50', card: 'bg-white border-amber-200', text: 'text-slate-900', subtext: 'text-slate-500' };
      case 'COOL':
        return { bg: 'bg-sky-50', card: 'bg-white border-sky-200', text: 'text-slate-900', subtext: 'text-slate-500' };
      default: // LIGHT
        return { bg: 'bg-slate-50', card: 'bg-white border-slate-200', text: 'text-slate-900', subtext: 'text-slate-500' };
    }
  };

  const themeStyles = getThemeStyles();
  const cardClass = themeStyles.card;

  // フォントファミリーのマッピング
  const getFontFamily = (fontId?: string) => {
    switch (fontId) {
      case 'noto-sans-jp': return '"Noto Sans JP", sans-serif';
      case 'zen-kaku-gothic': return '"Zen Kaku Gothic New", sans-serif';
      case 'm-plus-1p': return '"M PLUS 1p", sans-serif';
      default: return 'system-ui, sans-serif';
    }
  };

  // レイアウトのグリッドクラス
  const getGridClass = () => {
    switch (profile.layout) {
      case 'GRID_3': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 'GRID_4': return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
      case 'MASONRY': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'; // TODO: 実際のメイソンリーはライブラリが必要
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  // カスタムカラーのスタイル
  const primaryColor = profile.colorPrimary || '#3B82F6';
  const accentColor = profile.colorAccent || '#10B981';

  return (
    <div
      className={`min-h-screen ${themeStyles.bg} ${themeStyles.text}`}
      style={{ fontFamily: getFontFamily(profile.fontFamily) }}
    >
      
      {/* Header / Banner */}
      <div className="relative h-48 sm:h-64 bg-slate-200 overflow-hidden">
        {profile.headerUrl ? (
          <img 
            src={profile.headerUrl} 
            alt="Header" 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-300 to-indigo-400" />
        )}
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* Profile Info */}
        <div className="relative -mt-16 sm:-mt-24 mb-8 text-center sm:text-left sm:flex sm:items-end sm:space-x-6">
          <div className="relative mx-auto sm:mx-0 h-32 w-32 sm:h-40 sm:w-40 rounded-full ring-4 ring-white overflow-hidden bg-white">
            {profile.avatarUrl ? (
                <img 
                src={profile.avatarUrl} 
                alt={profile.displayName} 
                className="h-full w-full object-cover text-slate-300" 
                />
            ) : (
                <div className="h-full w-full bg-slate-200 flex items-center justify-center text-slate-400 text-4xl font-bold">
                    {profile.displayName.charAt(0)}
                </div>
            )}
          </div>
          <div className="mt-4 sm:mt-0 sm:pb-2 flex-1">
             <h1 className="text-2xl sm:text-3xl font-bold">{profile.displayName}</h1>
             <p className={`text-sm ${themeStyles.subtext}`}>@{params.username}</p>
          </div>
        </div>

        {/* Bio & Social */}
        <div className="space-y-6">
            <div className={`rounded-xl p-6 ${cardClass} shadow-sm`}>
                <p className="whitespace-pre-wrap leading-relaxed">{profile.bio || '自己紹介はまだありません。'}</p>
                
                {socialLinks.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                        {socialLinks.map(link => (
                            <a 
                                key={link.id} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${profile.theme === 'DARK' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                            >
                                {getPlatformIcon(link.platform)}
                                <span>{link.platform}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Artworks Gallery */}
            <div>
                <h2 className={`text-xl font-bold mb-4 ${themeStyles.text}`}>Gallery</h2>
                {artworks.length === 0 ? (
                    <div className={`text-center py-12 rounded-xl border border-dashed ${profile.theme === 'DARK' ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-500'}`}>
                        <p>作品はまだ公開されていません。</p>
                    </div>
                ) : (
                    <div className={`grid ${getGridClass()} gap-6`}>
                        {artworks.map(artwork => (
                            <Card key={artwork.id} className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow ${cardClass}`}>
                                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                     <img
                                        src={artwork.imageUrl}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                     />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-lg">{artwork.title}</h3>
                                    {artwork.description && (
                                        <p className={`text-sm mt-1 line-clamp-2 ${themeStyles.subtext}`}>{artwork.description}</p>
                                    )}

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* News/Announcements Section */}
            {posts && posts.length > 0 && (
                <div>
                    <h2 className={`text-xl font-bold mb-4 ${themeStyles.text}`}>お知らせ</h2>
                    <div className="space-y-4">
                        {posts.map(post => (
                            <Card key={post.id} className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow ${cardClass}`}>
                                <div className="flex flex-col sm:flex-row">
                                    {post.thumbnailUrl && (
                                        <div className="sm:w-40 h-32 sm:h-auto bg-slate-100 flex-shrink-0">
                                            <img
                                                src={post.thumbnailUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-4 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className={`h-4 w-4 ${themeStyles.subtext}`} />
                                            <span className={`text-xs ${themeStyles.subtext}`}>
                                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }) : ''}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                        <p className={`text-sm line-clamp-3 ${themeStyles.subtext}`}>
                                            {post.content}
                                        </p>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
