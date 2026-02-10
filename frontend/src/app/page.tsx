'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { PLAN_INFO, type PlanType } from '@/lib/subscription';
import { ImageIcon, Palette, Link2, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// useScrollReveal – Intersection Observer でフェードイン
// ---------------------------------------------------------------------------
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 浮遊する幾何学図形
// ---------------------------------------------------------------------------
const SHAPES = [
  { type: 'circle', color: 'bg-brand-green', size: 'w-12 h-12 md:w-16 md:h-16', top: '10%', left: '5%', duration: '6s', delay: '0s' },
  { type: 'triangle', color: 'text-brand-coral', size: 'w-10 h-10 md:w-14 md:h-14', top: '20%', right: '8%', duration: '7s', delay: '1s' },
  { type: 'square', color: 'border-slate-900', size: 'w-8 h-8 md:w-12 md:h-12', top: '65%', left: '3%', duration: '5.5s', delay: '0.5s' },
  { type: 'circle', color: 'bg-brand-coral/40', size: 'w-6 h-6 md:w-10 md:h-10', top: '75%', right: '12%', duration: '8s', delay: '2s' },
  { type: 'square', color: 'border-brand-green', size: 'w-10 h-10 md:w-14 md:h-14', top: '45%', left: '8%', duration: '6.5s', delay: '1.5s' },
  { type: 'circle', color: 'bg-slate-900/10', size: 'w-8 h-8 md:w-10 md:h-10', top: '30%', right: '3%', duration: '7.5s', delay: '0.8s' },
] as const;

function FloatingShapes() {
  return (
    <>
      {SHAPES.map((s, i) => {
        const posStyle: React.CSSProperties = {
          top: s.top,
          left: 'left' in s ? s.left : undefined,
          right: 'right' in s ? s.right : undefined,
          animationDuration: s.duration,
          animationDelay: s.delay,
        };
        const base = 'absolute animate-float pointer-events-none';
        if (s.type === 'circle') {
          return <div key={i} className={`${base} rounded-full ${s.color} ${s.size}`} style={posStyle} />;
        }
        if (s.type === 'triangle') {
          return (
            <svg key={i} className={`${base} ${s.color} ${s.size}`} style={posStyle} viewBox="0 0 40 40" fill="currentColor">
              <polygon points="20,4 36,36 4,36" />
            </svg>
          );
        }
        // square – outline only
        return <div key={i} className={`${base} border-2 ${s.color} ${s.size} rotate-12`} style={posStyle} />;
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// CSS Art モックアップ（ポートフォリオプレビュー）
// ---------------------------------------------------------------------------
function MockupCard() {
  return (
    <div className="relative w-64 md:w-80 rotate-3 hover:rotate-0 transition-transform duration-500 ease-out group">
      <div className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-[6px_6px_0px_#1A1A1A] group-hover:shadow-[8px_8px_0px_#1A1A1A] transition-shadow">
        {/* avatar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green to-emerald-400 border-2 border-slate-900" />
          <div>
            <div className="h-3 w-20 bg-slate-900 rounded-full" />
            <div className="h-2 w-14 bg-slate-300 rounded-full mt-1.5" />
          </div>
        </div>
        {/* gallery grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="aspect-square rounded bg-brand-green/60" />
          <div className="aspect-square rounded bg-brand-coral/60" />
          <div className="aspect-square rounded bg-sky-300/60" />
          <div className="aspect-square rounded bg-amber-300/60" />
          <div className="aspect-square rounded bg-violet-300/60" />
          <div className="aspect-square rounded bg-rose-300/60" />
        </div>
        {/* sns icons */}
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// テーマデモ プレビュー
// ---------------------------------------------------------------------------
type ThemeKey = 'LIGHT' | 'DARK' | 'WARM' | 'COOL';
const THEMES: Record<ThemeKey, { bg: string; text: string; accent: string; card: string; label: string }> = {
  LIGHT: { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-brand-green', card: 'bg-slate-100', label: 'Light' },
  DARK: { bg: 'bg-slate-900', text: 'text-white', accent: 'bg-brand-green', card: 'bg-slate-800', label: 'Dark' },
  WARM: { bg: 'bg-amber-50', text: 'text-amber-950', accent: 'bg-amber-400', card: 'bg-amber-100', label: 'Warm' },
  COOL: { bg: 'bg-sky-50', text: 'text-sky-950', accent: 'bg-sky-400', card: 'bg-sky-100', label: 'Cool' },
};

function ThemeDemo() {
  const [theme, setTheme] = useState<ThemeKey>('LIGHT');
  const t = THEMES[theme];
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
      {/* selector */}
      <div className="flex md:flex-col gap-3">
        {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTheme(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 text-sm font-bold transition-all ${
              theme === k
                ? 'border-slate-900 shadow-[3px_3px_0px_#1A1A1A]'
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full transition-all ${
                theme === k ? `${THEMES[k].accent} scale-125` : 'bg-slate-300'
              }`}
            />
            {THEMES[k].label}
          </button>
        ))}
      </div>
      {/* preview */}
      <div className={`relative w-72 md:w-80 rotate-1 border-2 border-slate-900 rounded-lg overflow-hidden shadow-[6px_6px_0px_#1A1A1A] transition-colors duration-300 ${t.bg} ${t.text}`}>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full ${t.accent} border-2 border-current/20`} />
            <div>
              <div className="h-3 w-20 rounded-full bg-current opacity-80" />
              <div className="h-2 w-14 rounded-full bg-current opacity-30 mt-1.5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {['opacity-40', 'opacity-30', 'opacity-50', 'opacity-25', 'opacity-45', 'opacity-35'].map((op, i) => (
              <div key={i} className={`aspect-square rounded ${t.card} ${op}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`w-6 h-6 rounded-full ${t.card}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// プランカード
// ---------------------------------------------------------------------------
function PlanCard({ plan, isRecommended }: { plan: PlanType; isRecommended?: boolean }) {
  const info = PLAN_INFO[plan];
  return (
    <div
      className={`relative flex flex-col border-2 rounded-lg p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] ${
        isRecommended
          ? 'border-brand-coral shadow-[4px_4px_0px_hsl(14,100%,70%)] scale-[1.03] z-10'
          : 'border-slate-200 shadow-[4px_4px_0px_#E5E7EB] hover:shadow-[6px_6px_0px_#E5E7EB]'
      }`}
    >
      {isRecommended && (
        <Badge variant="coral" className="absolute -top-3 left-4 text-xs">おすすめ</Badge>
      )}
      <h3 className="font-outfit font-black text-lg">{info.name}</h3>
      <p className="text-sm text-slate-500 mt-1">{info.description}</p>
      <p className="font-outfit font-black text-3xl mt-4">
        {info.price === 0 ? '¥0' : `¥${info.price.toLocaleString()}`}
        <span className="text-sm font-normal text-slate-500">{info.price > 0 ? '/月' : ''}</span>
      </p>
      <ul className="mt-4 space-y-2 flex-1">
        {info.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 mt-0.5 text-brand-green flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------
function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-10 md:mb-14">
      <span className="font-outfit font-black text-sm text-brand-coral">{number}</span>
      <div className="h-px flex-1 max-w-[40px] bg-slate-300" />
      <h2 className="font-outfit font-black text-2xl md:text-3xl tracking-tight">{title}</h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// メインページ
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const { user } = useAuth();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // ヒーローのstaggered reveal
    const timer = setTimeout(() => setHeroLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ctaHref = user ? '/dashboard' : '/register';
  const ctaLabel = user ? 'ダッシュボードへ →' : '無料ではじめる →';

  // ログイン済みユーザーがLPを見ることも許容する（自動リダイレクトしない）

  return (
    <div className="relative overflow-hidden">
      {/* ================================================================ */}
      {/* Header */}
      {/* ================================================================ */}
      <header className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b transition-colors ${scrolled ? 'border-slate-200' : 'border-transparent'}`}>
        <Link href="/" className="flex items-center gap-1">
          <span className="font-outfit font-black text-xl tracking-tight">PicMe</span>
          <SquigglyLine className="w-14 h-3 text-brand-green -ml-1" />
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm">ダッシュボードへ</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">ログイン</Button>
              </Link>
              <Link href="/register">
                <Button variant="accent" size="sm">無料ではじめる →</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* spacer for fixed header */}
      <div className="h-16" />

      {/* ================================================================ */}
      {/* Hero */}
      {/* ================================================================ */}
      <section className="relative min-h-[calc(100dvh-4rem)] flex items-center px-4 md:px-8 lg:px-16 py-16 md:py-0">
        <FloatingShapes />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-16">
          {/* left */}
          <div className="flex-1 max-w-xl">
            <p
              className={`text-sm font-bold text-brand-coral tracking-wider uppercase mb-4 transition-all duration-600 ease-out ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              クリエイターのためのポートフォリオ
            </p>

            <h1
              className={`font-outfit font-black text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-6 transition-all duration-600 ease-out ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              つくる人の、
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">見せる場所。</span>
                <span className="absolute bottom-1 left-0 w-full h-[0.35em] bg-brand-green -z-0 -skew-x-2" />
              </span>
            </h1>

            <p
              className={`text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-md transition-all duration-600 ease-out ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              イラスト・デザイン・写真。
              <br className="hidden sm:block" />
              あなたの作品を、1分でポートフォリオに。
            </p>

            <div
              className={`transition-all duration-600 ease-out ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <Link href={ctaHref}>
                <Button variant="accent" size="lg" className="text-base px-8 py-3 h-auto">
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </div>

          {/* right – mockup */}
          <div
            className={`flex-shrink-0 transition-all duration-700 ease-out ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <MockupCard />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 特徴セクション */}
      {/* ================================================================ */}
      <section className="px-4 md:px-8 lg:px-16 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <SectionTitle number="01" title="PicMeでできること" />
          </RevealSection>

          {/* staggered cards */}
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {[
              {
                icon: <ImageIcon className="w-10 h-10" />,
                accent: 'bg-brand-green',
                title: '作品をギャラリーで魅せる',
                desc: 'Masonry/グリッドで作品を美しく配置。カテゴリー・タグで絞り込み。',
                offset: 'md:mt-0',
                delay: 0,
              },
              {
                icon: <Palette className="w-10 h-10" />,
                accent: 'bg-brand-coral',
                title: 'テーマで自分らしく',
                desc: 'LIGHT・DARK・WARM・COOL。カラーもフォントもカスタマイズ。',
                offset: 'md:mt-10',
                delay: 100,
              },
              {
                icon: <Link2 className="w-10 h-10" />,
                accent: 'bg-slate-900',
                title: 'SNSリンクをひとまとめ',
                desc: 'Twitter、Instagram、pixiv…全SNSを1ページに。',
                offset: 'md:mt-5',
                delay: 200,
              },
            ].map((card) => (
              <RevealSection key={card.title} delay={card.delay} className={card.offset}>
                <div className="bg-white border-2 border-slate-900 rounded-lg p-6 transition-all hover:shadow-[6px_6px_0px_#1A1A1A] hover:translate-x-[-3px] hover:translate-y-[-3px]">
                  <div className={`w-full h-1.5 ${card.accent} rounded-full mb-5`} />
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="font-outfit font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* 追加機能バッジ */}
          <RevealSection delay={300} className="mt-8 flex flex-wrap gap-2 justify-center">
            {['お知らせ投稿', 'お問い合わせフォーム', 'アクセス解析', 'カスタムCSS', 'Markdown', 'D&D並び替え'].map(
              (label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ),
            )}
          </RevealSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/* テーマデモ */}
      {/* ================================================================ */}
      <section className="px-4 md:px-8 lg:px-16 py-20 md:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <SectionTitle number="02" title="あなたのページ、こんな感じに。" />
          </RevealSection>
          <RevealSection delay={100}>
            <ThemeDemo />
          </RevealSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ステップ */}
      {/* ================================================================ */}
      <section className="px-4 md:px-8 lg:px-16 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <SectionTitle number="03" title="はじめかた" />
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {[
              { num: '01', title: 'アカウント登録', desc: 'メールアドレスだけでOK' },
              { num: '02', title: '作品を追加', desc: '画像をアップロードするだけ' },
              { num: '03', title: '公開！', desc: 'あなた専用URLですぐ公開' },
            ].map((step, i) => (
              <RevealSection key={step.num} delay={i * 100}>
                <div className="relative text-center md:text-left">
                  <span className="font-outfit font-black text-7xl md:text-8xl text-slate-900/[0.06] leading-none select-none">
                    {step.num}
                  </span>
                  <div className="relative -mt-10 md:-mt-12">
                    <h3 className="font-outfit font-bold text-lg mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                  {/* connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-slate-300" />
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* プラン */}
      {/* ================================================================ */}
      <section className="px-4 md:px-8 lg:px-16 py-20 md:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <SectionTitle number="04" title="シンプルな料金" />
          </RevealSection>

          <RevealSection delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['FREE', 'STARTER', 'PRO', 'STUDIO'] as PlanType[]).map((p) => (
                <PlanCard key={p} plan={p} isRecommended={p === 'PRO'} />
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={200} className="mt-12 text-center">
            <Link href={ctaHref}>
              <Button variant="accent" size="lg" className="text-base px-8 py-3 h-auto">
                まずは無料ではじめる →
              </Button>
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/* フッター */}
      {/* ================================================================ */}
      <footer className="border-t-2 border-slate-900 px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <span className="font-outfit font-black text-slate-900">PicMe</span>
            <span>© 2026 PicMe</span>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-900 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
