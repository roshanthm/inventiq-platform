import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PaymentStatus, ShippingStatus, Priority } from '@/lib/types';

const paymentColors: Record<PaymentStatus, string> = {
  paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  refunded: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const shippingColors: Record<ShippingStatus, string> = {
  delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  shipped: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  processing: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const priorityColors: Record<Priority, string> = {
  low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  medium: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  urgent: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export function StatusBadge({ status, type }: { status: PaymentStatus | ShippingStatus | Priority; type: 'payment' | 'shipping' | 'priority' }) {
  const colorMap = type === 'payment' ? paymentColors : type === 'shipping' ? shippingColors : priorityColors;
  const color = colorMap[status as keyof typeof colorMap];

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        color
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </motion.span>
  );
}
