'use client';

import { AdBanner } from './AdBanner';

interface FreeUserAdProps {
  planType: string;
  slot: 'header' | 'profile' | 'gallery' | 'infeed';
  className?: string;
}

const AD_SLOTS: Record<string, string | undefined> = {
  header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER,
  profile: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PROFILE,
  gallery: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GALLERY,
  infeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED,
};

export function FreeUserAd({ planType, slot, className = '' }: FreeUserAdProps) {
  // 有料プランでは広告を表示しない
  if (planType !== 'FREE') {
    return null;
  }

  const adSlot = AD_SLOTS[slot];
  if (!adSlot) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <AdBanner
        adSlot={adSlot}
        adFormat={slot === 'infeed' ? 'fluid' : 'auto'}
      />
    </div>
  );
}
