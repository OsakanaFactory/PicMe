'use client';

import Link from 'next/link';
import { Crown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UpgradePromptProps {
  currentCount: number;
  limit: number;
  itemName: string;
  showWarningAt?: number;
}

export function UpgradePrompt({
  currentCount,
  limit,
  itemName,
  showWarningAt = 0.8
}: UpgradePromptProps) {
  const isAtLimit = currentCount >= limit;
  const isNearLimit = currentCount >= limit * showWarningAt && currentCount < limit;
  const remaining = limit - currentCount;

  if (limit === 2147483647) {
    return null;
  }

  if (isAtLimit) {
    return (
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>上限に達しました</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>
            {itemName}の上限（{limit}）に達しています。
            プランをアップグレードすると、より多くの{itemName}を追加できます。
          </span>
          <Link href="/upgrade">
            <Button size="sm" variant="primary" className="gap-2">
              <Crown className="h-4 w-4" />
              プランをアップグレード
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (isNearLimit) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">上限が近づいています</AlertTitle>
        <AlertDescription className="text-amber-700">
          {itemName}: {currentCount} / {limit}（残り{remaining}）
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

interface LimitBadgeProps {
  current: number;
  limit: number;
}

export function LimitBadge({ current, limit }: LimitBadgeProps) {
  if (limit === 2147483647) {
    return (
      <span className="text-sm text-slate-500">
        {current} 件
      </span>
    );
  }

  const percentage = (current / limit) * 100;
  const colorClass = percentage >= 100
    ? 'text-red-600'
    : percentage >= 80
      ? 'text-amber-600'
      : 'text-slate-500';

  return (
    <span className={`text-sm ${colorClass}`}>
      {current} / {limit}
    </span>
  );
}
