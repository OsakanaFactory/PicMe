'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

    // URLパラメータでキャンセルを検知
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
      const message = error.response?.data?.message || 'エラーが発生しました';
      toast.error(message);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('本当にサブスクリプションをキャンセルしますか？\n現在の請求期間終了まで利用できます。')) {
      return;
    }

    try {
      const response = await subscriptionApi.cancel();
      if (response.success) {
        setSubscription(response.data);
        toast.success('サブスクリプションのキャンセルを予約しました');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'キャンセルに失敗しました';
      toast.error(message);
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
      const message = error.response?.data?.message || '再開に失敗しました';
      toast.error(message);
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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">プランをアップグレード</h1>
        <p className="text-slate-500">
          より多くの機能を使って、ポートフォリオをパワーアップしましょう
        </p>
      </div>

      {/* Current Plan Status */}
      {subscription && subscription.planType !== 'FREE' && (
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              現在のプラン: {PLAN_INFO[subscription.planType].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {subscription.currentPeriodEnd && (
              <p className="text-sm text-slate-600">
                次回請求日: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ja-JP')}
              </p>
            )}
            {subscription.cancelAtPeriodEnd && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">キャンセル予約済み - 期間終了後にFreeプランに戻ります</span>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button variant="outline" size="sm" onClick={handleResume}>
                  キャンセルを取り消す
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  サブスクリプションをキャンセル
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(Object.entries(PLAN_INFO) as [PlanType, typeof PLAN_INFO[PlanType]][]).map(([planType, plan]) => {
          const isCurrentPlan = currentPlan === planType;
          const isDowngrade = getPlanOrder(planType) < getPlanOrder(currentPlan);
          const isUpgrade = getPlanOrder(planType) > getPlanOrder(currentPlan);

          return (
            <Card
              key={planType}
              className={`relative flex flex-col ${
                plan.recommended
                  ? 'border-2 border-primary shadow-lg'
                  : isCurrentPlan
                    ? 'border-2 border-green-500'
                    : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Sparkles className="h-3 w-3 mr-1" />
                    おすすめ
                  </Badge>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    現在のプラン
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-6">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.priceLabel}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button className="w-full" disabled>
                    現在のプラン
                  </Button>
                ) : planType === 'FREE' ? (
                  <Button className="w-full" variant="outline" disabled>
                    デフォルトプラン
                  </Button>
                ) : isDowngrade ? (
                  <Button className="w-full" variant="outline" disabled>
                    ダウングレード不可
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(planType)}
                    disabled={processingPlan !== null}
                  >
                    {processingPlan === planType ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        処理中...
                      </>
                    ) : (
                      `${plan.name}にアップグレード`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Usage Info */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">現在の利用状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <UsageStat
                label="作品"
                max={subscription.limits.maxArtworks}
              />
              <UsageStat
                label="SNSリンク"
                max={subscription.limits.maxSocialLinks}
              />
              <UsageStat
                label="お知らせ"
                max={subscription.limits.maxPosts}
              />
              <UsageStat
                label="カテゴリー"
                max={subscription.limits.maxCategories}
              />
              <UsageStat
                label="ストレージ"
                max={subscription.limits.maxStorageMb}
                unit="MB"
              />
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">広告</p>
                <p className="text-lg font-semibold">
                  {subscription.limits.hasAds ? 'あり' : 'なし'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function UsageStat({ label, max, unit }: { label: string; max: number; unit?: string }) {
  const displayMax = max === 2147483647 ? '無制限' : `${max}${unit || ''}`;

  return (
    <div className="text-center p-3 bg-slate-50 rounded-lg">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-semibold">{displayMax}</p>
    </div>
  );
}

function getPlanOrder(plan: PlanType): number {
  const order: Record<PlanType, number> = {
    FREE: 0,
    STARTER: 1,
    PRO: 2,
    STUDIO: 3,
  };
  return order[plan];
}
