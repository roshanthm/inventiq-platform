import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  accent?: string;
}

export function KPICard({ title, icon, children, className, accent }: KPICardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'gradient-border glow-hover relative overflow-hidden rounded-2xl p-5',
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl"
        style={{ background: accent || 'hsl(var(--primary))' }}
      />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl glass" style={{ color: accent || 'hsl(var(--primary))' }}>
            {icon}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
