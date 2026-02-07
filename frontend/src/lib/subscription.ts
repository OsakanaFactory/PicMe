import api from './api';

export type PlanType = 'FREE' | 'STARTER' | 'PRO' | 'STUDIO';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING';

export interface PlanLimits {
  maxArtworks: number;
  maxSocialLinks: number;
  maxPosts: number;
  maxCategories: number;
  maxStorageMb: number;
  hasAds: boolean;
}

export interface SubscriptionData {
  planType: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  limits: PlanLimits;
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data: SubscriptionData;
}

export interface CheckoutResponse {
  success: boolean;
  sessionId: string;
  checkoutUrl: string;
  message?: string;
}

export const subscriptionApi = {
  getStatus: async (): Promise<SubscriptionResponse> => {
    const response = await api.get('/api/subscriptions/status');
    return response.data;
  },

  createCheckout: async (planType: PlanType): Promise<CheckoutResponse> => {
    const response = await api.post('/api/subscriptions/checkout', { planType });
    return response.data;
  },

  cancel: async (): Promise<SubscriptionResponse> => {
    const response = await api.post('/api/subscriptions/cancel');
    return response.data;
  },

  resume: async (): Promise<SubscriptionResponse> => {
    const response = await api.post('/api/subscriptions/resume');
    return response.data;
  },
};

export const PLAN_INFO: Record<PlanType, {
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  recommended?: boolean;
}> = {
  FREE: {
    name: 'Free',
    price: 0,
    priceLabel: '無料',
    description: 'まずは試してみたい方に',
    features: [
      '作品5枚まで',
      'SNSリンク2つまで',
      'お知らせ1件まで',
      '300MB ストレージ',
      '広告表示あり',
    ],
  },
  STARTER: {
    name: 'Starter',
    price: 480,
    priceLabel: '¥480/月',
    description: '個人クリエイター向け',
    features: [
      '作品20枚まで',
      'SNSリンク5つまで',
      'お知らせ5件まで',
      '1GB ストレージ',
      '広告なし',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 680,
    priceLabel: '¥680/月',
    description: '本格的に活動する方に',
    recommended: true,
    features: [
      '作品50枚まで',
      'SNSリンク10個まで',
      'お知らせ20件まで',
      'カテゴリー5つまで',
      '2GB ストレージ',
      '広告なし',
    ],
  },
  STUDIO: {
    name: 'Studio',
    price: 1980,
    priceLabel: '¥1,980/月',
    description: 'プロフェッショナル向け',
    features: [
      '作品200枚まで',
      'SNSリンク無制限',
      'お知らせ無制限',
      'カテゴリー無制限',
      '10GB ストレージ',
      '広告なし',
      '優先サポート',
    ],
  },
};
