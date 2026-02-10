'use client';

import { motion } from 'framer-motion';
import { dashFadeIn } from '@/lib/motion';
import { SquigglyLine } from '@/components/ui/squiggly-line';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  accentColor?: string;
  children?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, description, accentColor = 'text-brand-green', children }: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      variants={dashFadeIn}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${accentColor}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-outfit font-black text-2xl md:text-3xl tracking-tight">{title}</h1>
            <SquigglyLine className="w-10 h-3 text-brand-green hidden sm:block" />
          </div>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <motion.div
          className="flex gap-2 flex-shrink-0"
          variants={dashFadeIn}
          custom={0.1}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
