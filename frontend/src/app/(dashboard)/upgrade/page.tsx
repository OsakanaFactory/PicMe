'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { motion, AnimatePresence } from 'framer-motion';
import { dashStaggerContainer, dashStaggerItem, dashFadeIn } from '@/lib/motion';
import { Check, Loader2, Crown, Sparkles, AlertCircle } from 'lucide-react';
import { subscriptionApi, SubscriptionData, PlanType, PLAN_INFO } from '@/lib/subscription';
import { toast } from 'sonner';

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    fetchSubscription();
    if (searchParams.get('canceled') === 'true') {
      toast.info('チェックアウトがキャンセルされました');
    }
  }, [searchParams]);

  const fetchSubscription = async () => {
    try {
      const response = await subscriptionApi.getStatus();
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      toast.error('サブスクリプション情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: PlanType) => {
    if (planType === 'FREE') return;
    setProcessingPlan(planType);
    try {
      const response = await subscriptionApi.createCheckout(planType);
      if (response.success && response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        toast.error(response.message || 'チェックアウトの作成に失敗しました');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'エラーが発生しました');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('本当にサブスクリプションをキャンセルしますか？\n現在の請求期間終了まで利用できます。')) return;
    try {
      const response = await subscriptionApi.cancel();
      if (response.success) {
        setSubscription(response.data);
        toast.success('サブスクリプションのキャンセルを予約しました');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'キャンセルに失敗しました');
    }
  };

  const handleResume = async () => {
    try {
      const response = await subscriptionApi.resume();
      if (response.success) {
        setSubscription(response.data);
        toast.success('サブスクリプションを再開しました');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '再開に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const currentPlan = subscription?.planType || 'FREE';

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Crown}
        title="プランをアップグレード"
        description="より多くの機能を使って、ポートフォリオをパワーアップしましょう"
        accentColor="text-brand-coral"
      />

      {/* Current Plan Status */}
      <AnimatePresence>
        {subscription && subscription.planType !== 'FREE' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-slate-900 shadow-[4px_4px_0px_#1A1A1A] rounded-lg bg-white p-5"
          >
            <h3 className="font-outfit font-bold text-lg flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-yellow-500" />
              現在のプラン: {PLAN_INFO[subscription.planType].name}
            </h3>
            <div className="space-y-2">
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-slate-600">
                  次回請求日: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ja-JP')}
                </p>
              )}
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">キャンセル予約済み - 期間終了後にFreeプランに戻ります</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {subscription.cancelAtPeriodEnd ? (
                  <Button variant="outline" size="sm" onClick={handleResume}>キャンセルを取り消す</Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleCancel}>サブスクリプションをキャンセル</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Cards - ネオブルータリスト */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={dashStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        {(Object.entries(PLAN_INFO) as [PlanType, typeof PLAN_INFO[PlanType]][]).map(([planType, plan]) => {
          const isCurrentPlan = currentPlan === planType;
          const isDowngrade = getPlanOrder(planType) < getPlanOrder(currentPlan);
          const isRecommended = plan.recommended;

          return (
            <motion.div
              key={planType}
              variants={dashStaggerItem}
              whileHover={{
                x: -3,
                y: -3,
                boxShadow: isRecommended
                  ? '8px 8px 0px hsl(14,100%,70%)'
                  : isCurrentPlan
                    ? '8px 8px 0px #D9F99D'
                    : '8px 8px 0px #E5E7EB',
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className={`relative flex flex-col border-2 rounded-lg p-6 bg-white ${
                isRecommended
                  ? 'border-brand-coral shadow-[4px_4px_0px_hsl(14,100%,70%)]'
                  : isCurrentPlan
                    ? 'border-brand-green shadow-[4px_4px_0px_#D9F99D]'
                    : 'border-slate-200 shadow-[4px_4px_0px_#E5E7EB]'
              }`}
            >
              {isRecommended && !isCurrentPlan && (
                <Badge variant="coral" className="absolute -top-3 left-4 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  おすすめ
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-4 text-xs bg-brand-green text-slate-900 border-0">
                  現在のプラン
                </Badge>
              )}

              <h3 className="font-outfit font-black text-lg mt-1">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              <p className="font-outfit font-black text-3xl mt-4">
                {plan.priceLabel}
              </p>

              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-brand-green flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrentPlan ? (
                  <Button className="w-full" disabled>現在のプラン</Button>
                ) : planType === 'FREE' ? (
                  <Button className="w-full" variant="outline" disabled>デフォルトプラン</Button>
                ) : isDowngrade ? (
                  <Button className="w-full" variant="outline" disabled>ダウングレード不可</Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(planType)}
                    disabled={processingPlan !== null}
                  >
                    {processingPlan === planType ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />処理中...</>
                    ) : (
                      `${plan.name}にアップグレード`
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Usage Info */}
      {subscription && (
        <motion.div
          className="border-2 border-slate-200 rounded-lg bg-white overflow-hidden"
          variants={dashFadeIn}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <div className="p-6">
            <h3 className="font-outfit font-bold text-lg mb-4">現在の利用状況</h3>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <UsageStat label="作品" max={subscription.limits.maxArtworks} accent="bg-brand-green" />
              <UsageStat label="SNSリンク" max={subscription.limits.maxSocialLinks} accent="bg-brand-coral" />
              <UsageStat label="お知らせ" max={subscription.limits.maxPosts} accent="bg-sky-400" />
              <UsageStat label="カテゴリー" max={subscription.limits.maxCategories} accent="bg-violet-400" />
              <UsageStat label="ストレージ" max={subscription.limits.maxStorageMb} unit="MB" accent="bg-amber-400" />
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">広告</p>
                <p className="text-lg font-bold font-outfit">{subscription.limits.hasAds ? 'あり' : 'なし'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function UsageStat({ label, max, unit, accent = 'bg-slate-400' }: { label: string; max: number; unit?: string; accent?: string }) {
  const displayMax = max === 2147483647 ? '無制限' : `${max}${unit || ''}`;
  return (
    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div className={`w-8 h-1 ${accent} rounded-full mx-auto mb-2`} />
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-bold font-outfit">{displayMax}</p>
    </div>
  );
}

function getPlanOrder(plan: PlanType): number {
  const order: Record<PlanType, number> = { FREE: 0, STARTER: 1, PRO: 2, STUDIO: 3 };
  return order[plan];
}
