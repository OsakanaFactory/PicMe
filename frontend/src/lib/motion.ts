// ---------------------------------------------------------------------------
// 共通アニメーションバリアント
// ---------------------------------------------------------------------------

// LP用: ゆっくり大きめのアニメーション
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// ダッシュボード用: 軽量で速いアニメーション
export const dashFadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const, delay },
  }),
};

export const dashStaggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const dashStaggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
};

// スケールインアニメーション（空状態アイコン用）
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// ネオブルータリスト ホバー効果
export const neoBrutalistHover = {
  x: -3,
  y: -3,
  boxShadow: '6px 6px 0px #1A1A1A',
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

export const cardHoverLift = {
  y: -4,
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

// ネオブルータリスト カードスタイル定数
export const NEO_CARD = 'border-2 border-slate-900 shadow-[4px_4px_0px_#1A1A1A]';
export const NEO_CARD_ACCENT = 'border-2 border-slate-900 shadow-[4px_4px_0px_hsl(14,100%,70%)]';
