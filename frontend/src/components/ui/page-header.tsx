'use client';

import { motion } from 'framer-motion';
import { dashFadeIn } from '@/lib/motion';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  accentColor?: string;
  children?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, description, accentColor, children }: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      variants={dashFadeIn}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1" style={accentColor ? { color: accentColor } : undefined}>
          <Icon className={`h-6 w-6 ${!accentColor ? 'text-slate-400' : ''}`} />
        </div>
        <div>
          <h1 className="font-outfit font-bold text-2xl tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex gap-2 flex-shrink-0">
          {children}
        </div>
      )}
    </motion.div>
  );
}
