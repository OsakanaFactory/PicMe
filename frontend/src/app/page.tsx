'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { PLAN_INFO, type PlanType } from '@/lib/subscription';
import { ImageIcon, Palette, Link2, Check } from 'lucide-react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

// ---------------------------------------------------------------------------
// アニメーション variants
// ---------------------------------------------------------------------------
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// ---------------------------------------------------------------------------
// 浮遊する幾何学図形（ページ全体に散りばめ + パララックス）
// ---------------------------------------------------------------------------
interface ShapeDef {
  type: 'circle' | 'triangle' | 'square' | 'ring' | 'wave';
  color: string;
  size: number;
  x: string;
  y: string;
  parallaxSpeed: number;
  floatDuration: number;
  floatDelay: number;
  rotate?: number;
}

const ALL_SHAPES: ShapeDef[] = [
  // ヒーロー周辺
  { type: 'circle', color: '#D9F99D', size: 48, x: '5%', y: '8%', parallaxSpeed: -0.15, floatDuration: 6, floatDelay: 0 },
  { type: 'triangle', color: '#FF8A65', size: 44, x: '88%', y: '15%', parallaxSpeed: -0.1, floatDuration: 7, floatDelay: 1 },
  { type: 'square', color: '#1A1A1A', size: 36, x: '3%', y: '55%', parallaxSpeed: -0.2, floatDuration: 5.5, floatDelay: 0.5, rotate: 12 },
  { type: 'ring', color: '#D9F99D', size: 52, x: '92%', y: '45%', parallaxSpeed: -0.12, floatDuration: 6.5, floatDelay: 1.5 },
  { type: 'circle', color: '#FF8A65', size: 28, x: '85%', y: '70%', parallaxSpeed: -0.18, floatDuration: 8, floatDelay: 2 },
  // 特徴セクション周辺
  { type: 'wave', color: '#D9F99D', size: 60, x: '2%', y: '105%', parallaxSpeed: -0.08, floatDuration: 9, floatDelay: 0.3 },
  { type: 'triangle', color: '#1A1A1A', size: 32, x: '95%', y: '115%', parallaxSpeed: -0.14, floatDuration: 7.5, floatDelay: 0.8, rotate: 45 },
  { type: 'circle', color: '#D9F99D80', size: 40, x: '8%', y: '135%', parallaxSpeed: -0.1, floatDuration: 6, floatDelay: 1.2 },
  // テーマデモ周辺
  { type: 'ring', color: '#FF8A65', size: 44, x: '90%', y: '170%', parallaxSpeed: -0.16, floatDuration: 7, floatDelay: 0 },
  { type: 'square', color: '#D9F99D', size: 30, x: '4%', y: '190%', parallaxSpeed: -0.12, floatDuration: 8, floatDelay: 1.8, rotate: -15 },
  // ステップセクション周辺
  { type: 'triangle', color: '#FF8A65', size: 36, x: '93%', y: '240%', parallaxSpeed: -0.1, floatDuration: 6.5, floatDelay: 0.5 },
  { type: 'circle', color: '#1A1A1A18', size: 56, x: '6%', y: '260%', parallaxSpeed: -0.2, floatDuration: 9, floatDelay: 1 },
  // プランセクション周辺
  { type: 'wave', color: '#FF8A65', size: 50, x: '88%', y: '310%', parallaxSpeed: -0.08, floatDuration: 7, floatDelay: 0.6 },
  { type: 'ring', color: '#1A1A1A', size: 38, x: '3%', y: '340%', parallaxSpeed: -0.14, floatDuration: 8, floatDelay: 2 },
  { type: 'circle', color: '#D9F99D', size: 24, x: '96%', y: '360%', parallaxSpeed: -0.1, floatDuration: 5.5, floatDelay: 0.3 },
];

function ShapeElement({ shape }: { shape: ShapeDef }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 5000], [0, 5000 * shape.parallaxSpeed]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

  const floatStyle: React.CSSProperties = {
    animation: `float ${shape.floatDuration}s ease-in-out infinite`,
    animationDelay: `${shape.floatDelay}s`,
  };

  const common = 'pointer-events-none';

  if (shape.type === 'circle') {
    return (
      <motion.div
        className={common}
        style={{
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          backgroundColor: shape.color,
          y: smoothY,
          ...floatStyle,
        }}
      />
    );
  }

  if (shape.type === 'ring') {
    return (
      <motion.div
        className={common}
        style={{
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          border: `2px solid ${shape.color}`,
          y: smoothY,
          ...floatStyle,
        }}
      />
    );
  }

  if (shape.type === 'triangle') {
    return (
      <motion.svg
        className={common}
        width={shape.size}
        height={shape.size}
        viewBox="0 0 40 40"
        fill={shape.color}
        style={{
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          rotate: shape.rotate ?? 0,
          y: smoothY,
          ...floatStyle,
        }}
      >
        <polygon points="20,4 36,36 4,36" />
      </motion.svg>
    );
  }

  if (shape.type === 'square') {
    return (
      <motion.div
        className={common}
        style={{
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          width: shape.size,
          height: shape.size,
          border: `2px solid ${shape.color}`,
          rotate: shape.rotate ?? 0,
          y: smoothY,
          ...floatStyle,
        }}
      />
    );
  }

  // wave
  return (
    <motion.svg
      className={common}
      width={shape.size}
      height={shape.size * 0.4}
      viewBox="0 0 100 40"
      fill="none"
      style={{
        position: 'absolute',
        left: shape.x,
        top: shape.y,
        y: smoothY,
        ...floatStyle,
      }}
    >
      <path
        d="M0 20C12 20 12 8 24 8C36 8 36 32 48 32C60 32 60 20 72 20C84 20 84 8 96 8"
        stroke={shape.color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

function GlobalFloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {ALL_SHAPES.map((shape, i) => (
        <ShapeElement key={i} shape={shape} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSS Art モックアップ（ポートフォリオプレビュー）
// ---------------------------------------------------------------------------
function MockupCard() {
  return (
    <motion.div
      className="relative w-64 md:w-80"
      initial={{ rotate: 3 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.div
        className="bg-white border-2 border-slate-900 rounded-lg p-5"
        initial={{ boxShadow: '6px 6px 0px #1A1A1A' }}
        whileHover={{ boxShadow: '10px 10px 0px #1A1A1A' }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* avatar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green to-emerald-400 border-2 border-slate-900" />
          <div>
            <div className="h-3 w-20 bg-slate-900 rounded-full" />
            <div className="h-2 w-14 bg-slate-300 rounded-full mt-1.5" />
          </div>
        </div>
        {/* gallery grid */}
        <motion.div
          className="grid grid-cols-3 gap-2 mb-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {['bg-brand-green/60', 'bg-brand-coral/60', 'bg-sky-300/60', 'bg-amber-300/60', 'bg-violet-300/60', 'bg-rose-300/60'].map(
            (color) => (
              <motion.div
                key={color}
                className={`aspect-square rounded ${color}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                }}
              />
            ),
          )}
        </motion.div>
        {/* sns icons */}
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300" />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// テーマデモ プレビュー
// ---------------------------------------------------------------------------
type ThemeKey = 'LIGHT' | 'DARK' | 'WARM' | 'COOL';

interface ThemeConfig {
  bg: string;
  text: string;
  accent: string;
  card: string;
  label: string;
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  LIGHT: { bg: '#ffffff', text: '#0f172a', accent: '#D9F99D', card: '#f1f5f9', label: 'Light' },
  DARK: { bg: '#0f172a', text: '#ffffff', accent: '#D9F99D', card: '#1e293b', label: 'Dark' },
  WARM: { bg: '#fffbeb', text: '#451a03', accent: '#fbbf24', card: '#fef3c7', label: 'Warm' },
  COOL: { bg: '#f0f9ff', text: '#082f49', accent: '#38bdf8', card: '#e0f2fe', label: 'Cool' },
};

function ThemeDemo() {
  const [theme, setTheme] = useState<ThemeKey>('LIGHT');
  const t = THEMES[theme];
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
      {/* selector */}
      <motion.div className="flex md:flex-col gap-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
          <motion.button
            key={k}
            variants={staggerItem}
            onClick={() => setTheme(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 text-sm font-bold transition-colors ${
              theme === k
                ? 'border-slate-900 shadow-[3px_3px_0px_#1A1A1A]'
                : 'border-slate-200 hover:border-slate-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="w-3 h-3 rounded-full"
              animate={{
                backgroundColor: theme === k ? THEMES[k].accent : '#cbd5e1',
                scale: theme === k ? 1.3 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            {THEMES[k].label}
          </motion.button>
        ))}
      </motion.div>
      {/* preview */}
      <motion.div
        className="relative w-72 md:w-80 border-2 border-slate-900 rounded-lg overflow-hidden"
        initial={{ rotate: 1 }}
        whileHover={{ rotate: 0, scale: 1.02 }}
        animate={{
          backgroundColor: t.bg,
          color: t.text,
          boxShadow: '6px 6px 0px #1A1A1A',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-10 h-10 rounded-full border-2"
              animate={{ backgroundColor: t.accent, borderColor: t.text + '33' }}
              transition={{ duration: 0.4 }}
            />
            <div>
              <motion.div className="h-3 w-20 rounded-full" animate={{ backgroundColor: t.text + 'cc' }} transition={{ duration: 0.4 }} />
              <motion.div className="h-2 w-14 rounded-full mt-1.5" animate={{ backgroundColor: t.text + '4d' }} transition={{ duration: 0.4 }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[0.6, 0.45, 0.7, 0.4, 0.65, 0.5].map((op, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded"
                animate={{ backgroundColor: t.card, opacity: op }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                className="w-6 h-6 rounded-full"
                animate={{ backgroundColor: t.card }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// プランカード
// ---------------------------------------------------------------------------
function PlanCard({ plan, isRecommended, index }: { plan: PlanType; isRecommended?: boolean; index: number }) {
  const info = PLAN_INFO[plan];
  return (
    <motion.div
      className={`relative flex flex-col border-2 rounded-lg p-6 bg-white ${
        isRecommended
          ? 'border-brand-coral shadow-[4px_4px_0px_hsl(14,100%,70%)] scale-[1.03] z-10'
          : 'border-slate-200 shadow-[4px_4px_0px_#E5E7EB]'
      }`}
      variants={staggerItem}
      whileHover={{
        x: -3,
        y: -3,
        boxShadow: isRecommended
          ? '8px 8px 0px hsl(14,100%,70%)'
          : '8px 8px 0px #E5E7EB',
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
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
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------
function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <motion.div
      className="flex items-center gap-3 mb-10 md:mb-14"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={0}
    >
      <span className="font-outfit font-black text-sm text-brand-coral">{number}</span>
      <div className="h-px flex-1 max-w-[40px] bg-slate-300" />
      <h2 className="font-outfit font-black text-2xl md:text-3xl tracking-tight">{title}</h2>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// メインページ
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ctaHref = user ? '/dashboard' : '/register';
  const ctaLabel = user ? 'ダッシュボードへ →' : '無料ではじめる →';

  return (
    <div className="relative overflow-hidden">
      {/* 全ページ散りばめ幾何学図形 */}
      <GlobalFloatingShapes />

      {/* ================================================================ */}
      {/* Header */}
      {/* ================================================================ */}
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b transition-colors ${
          scrolled ? 'border-slate-200' : 'border-transparent'
        }`}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
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
      </motion.header>

      {/* spacer for fixed header */}
      <div className="h-16" />

      {/* ================================================================ */}
      {/* Hero */}
      {/* ================================================================ */}
      <section className="relative min-h-[calc(100dvh-4rem)] flex items-center px-4 md:px-8 lg:px-16 py-16 md:py-0">
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* left */}
          <div className="flex-1 max-w-xl">
            <motion.p
              className="text-sm font-bold text-brand-coral tracking-wider uppercase mb-4"
              variants={staggerItem}
            >
              クリエイターのためのポートフォリオ
            </motion.p>

            <motion.h1
              className="font-outfit font-black text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-6"
              variants={staggerItem}
            >
              つくる人の、
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">見せる場所。</span>
                <motion.span
                  className="absolute bottom-1 left-0 w-full h-[0.35em] bg-brand-green -z-0 -skew-x-2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' as const }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-md"
              variants={staggerItem}
            >
              イラスト・デザイン・写真。
              <br className="hidden sm:block" />
              あなたの作品を、1分でポートフォリオに。
            </motion.p>

            <motion.div variants={staggerItem}>
              <Link href={ctaHref}>
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button variant="accent" size="lg" className="text-base px-8 py-3 h-auto">
                    {ctaLabel}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* right – mockup */}
          <motion.div className="flex-shrink-0" variants={staggerItem}>
            <MockupCard />
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/* 特徴セクション */}
      {/* ================================================================ */}
      <section className="relative px-4 md:px-8 lg:px-16 py-20 md:py-28">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionTitle number="01" title="PicMeでできること" />

          {/* staggered cards */}
          <motion.div
            className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {[
              {
                icon: <ImageIcon className="w-10 h-10" />,
                accent: 'bg-brand-green',
                title: '作品をギャラリーで魅せる',
                desc: 'Masonry/グリッドで作品を美しく配置。カテゴリー・タグで絞り込み。',
                offset: 'md:mt-0',
              },
              {
                icon: <Palette className="w-10 h-10" />,
                accent: 'bg-brand-coral',
                title: 'テーマで自分らしく',
                desc: 'LIGHT・DARK・WARM・COOL。カラーもフォントもカスタマイズ。',
                offset: 'md:mt-10',
              },
              {
                icon: <Link2 className="w-10 h-10" />,
                accent: 'bg-slate-900',
                title: 'SNSリンクをひとまとめ',
                desc: 'Twitter、Instagram、pixiv…全SNSを1ページに。',
                offset: 'md:mt-5',
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                className={card.offset}
                variants={staggerItem}
              >
                <motion.div
                  className="bg-white border-2 border-slate-900 rounded-lg p-6"
                  whileHover={{
                    x: -3,
                    y: -3,
                    boxShadow: '6px 6px 0px #1A1A1A',
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                  initial={{ boxShadow: '0px 0px 0px #1A1A1A' }}
                >
                  <div className={`w-full h-1.5 ${card.accent} rounded-full mb-5`} />
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="font-outfit font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* 追加機能バッジ */}
          <motion.div
            className="mt-8 flex flex-wrap gap-2 justify-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {['お知らせ投稿', 'お問い合わせフォーム', 'アクセス解析', 'カスタムCSS', 'Markdown', 'D&D並び替え'].map(
              (label) => (
                <motion.div key={label} variants={staggerItem}>
                  <Badge variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* テーマデモ */}
      {/* ================================================================ */}
      <section className="relative px-4 md:px-8 lg:px-16 py-20 md:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionTitle number="02" title="あなたのページ、こんな感じに。" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
          >
            <ThemeDemo />
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ステップ */}
      {/* ================================================================ */}
      <section className="relative px-4 md:px-8 lg:px-16 py-20 md:py-28">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionTitle number="03" title="はじめかた" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {[
              { num: '01', title: 'アカウント登録', desc: 'メールアドレスだけでOK' },
              { num: '02', title: '作品を追加', desc: '画像をアップロードするだけ' },
              { num: '03', title: '公開！', desc: 'あなた専用URLですぐ公開' },
            ].map((step, i) => (
              <motion.div key={step.num} className="relative text-center md:text-left" variants={staggerItem}>
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* プラン */}
      {/* ================================================================ */}
      <section className="relative px-4 md:px-8 lg:px-16 py-20 md:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionTitle number="04" title="シンプルな料金" />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {(['FREE', 'STARTER', 'PRO', 'STUDIO'] as PlanType[]).map((p, i) => (
              <PlanCard key={p} plan={p} isRecommended={p === 'PRO'} index={i} />
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href={ctaHref}>
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button variant="accent" size="lg" className="text-base px-8 py-3 h-auto">
                  まずは無料ではじめる →
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* フッター */}
      {/* ================================================================ */}
      <footer className="relative z-10 border-t-2 border-slate-900 px-4 md:px-8 lg:px-16 py-8">
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
