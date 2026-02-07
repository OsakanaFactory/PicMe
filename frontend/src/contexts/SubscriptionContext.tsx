'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptionApi, SubscriptionData, PlanType, PlanLimits } from '@/lib/subscription';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFeatureAvailable: (feature: 'categories' | 'tags' | 'markdown') => boolean;
  canAdd: (type: 'artworks' | 'socialLinks' | 'posts' | 'categories') => boolean;
  getLimit: (type: 'artworks' | 'socialLinks' | 'posts' | 'categories' | 'storageMb') => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const response = await subscriptionApi.getStatus();
      if (response.success) {
        setSubscription(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      setError('サブスクリプション情報の取得に失敗しました');
      // エラー時はデフォルトFREEプランとして動作
      setSubscription({
        planType: 'FREE',
        status: 'ACTIVE',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        limits: {
          maxArtworks: 5,
          maxSocialLinks: 2,
          maxPosts: 1,
          maxCategories: 0,
          maxStorageMb: 300,
          hasAds: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const isFeatureAvailable = (feature: 'categories' | 'tags' | 'markdown'): boolean => {
    if (!subscription) return false;

    const plan = subscription.planType;

    switch (feature) {
      case 'categories':
      case 'tags':
        return plan === 'PRO' || plan === 'STUDIO';
      case 'markdown':
        return plan === 'PRO' || plan === 'STUDIO';
      default:
        return false;
    }
  };

  const getLimit = (type: 'artworks' | 'socialLinks' | 'posts' | 'categories' | 'storageMb'): number => {
    if (!subscription) return 0;

    const limits = subscription.limits;
    switch (type) {
      case 'artworks':
        return limits.maxArtworks;
      case 'socialLinks':
        return limits.maxSocialLinks;
      case 'posts':
        return limits.maxPosts;
      case 'categories':
        return limits.maxCategories;
      case 'storageMb':
        return limits.maxStorageMb;
      default:
        return 0;
    }
  };

  const canAdd = (type: 'artworks' | 'socialLinks' | 'posts' | 'categories'): boolean => {
    const limit = getLimit(type);
    return limit > 0 || limit === 2147483647;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        refetch: fetchSubscription,
        isFeatureAvailable,
        canAdd,
        getLimit,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
