import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, User, Mail, Package, Truck, CheckCircle2, Circle, Clock, DollarSign, Building2, Box } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { Button } from '@/components/ui/button';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useDataStore((s) => s.orders);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">Order not found</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">Back to Orders</Button>
        </div>
      </PageTransition>
    );
  }

  const completedSteps = order.timeline.filter((t) => t.done).length;
  const progress = (completedSteps / order.timeline.length) * 100;

  return (
    <PageTransition>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{order.id}</h1>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.paymentStatus} type="payment" />
          <StatusBadge status={order.shippingStatus} type="shipping" />
          <StatusBadge status={order.priority} type="priority" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Info */}
        <div className="space-y-4 lg:col-span-2">
          {/* Shipment Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
            <h3 className="mb-4 text-sm font-semibold">Shipment Progress</h3>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{completedSteps} of {order.timeline.length} steps completed</span>
              <span className="font-semibold text-primary">{progress.toFixed(0)}%</span>
            </div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-chart-4"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            {/* Timeline */}
            <div className="relative">
              {order.timeline.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {i < order.timeline.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-border" />
                  )}
                  <div className="relative z-10">
                    {step.done ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring' }}>
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <Circle className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`text-sm font-medium ${step.done ? '' : 'text-muted-foreground'}`}>{step.status}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {step.date}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-border rounded-2xl p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Package className="h-4 w-4 text-primary" /> Products</h3>
            <div className="space-y-2">
              {order.products.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.qty} × ${p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">${(p.qty * p.price).toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
              <span className="text-sm font-semibold">Total Amount</span>
              <AnimatedCounter value={order.totalAmount} prefix="$" className="text-lg font-bold text-gradient" />
            </div>
          </motion.div>
        </div>

      {/* Right: Customer & Meta */}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4 text-primary" /> Customer</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 text-sm font-bold text-white">
                {order.customer.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{order.customer}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {order.customerEmail}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4 text-primary" /> Order Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Order Date</span>
              <span className="font-medium">{order.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Warehouse</span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{order.warehouse}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground"><DollarSign className="h-4 w-4" /> Total</span>
              <span className="font-semibold">${order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4" /> Shipping</span>
              <StatusBadge status={order.shippingStatus} type="shipping" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Last updated: {order.timeline[order.timeline.length - 1].date}
          </div>
          <Link to="/orders">
            <Button variant="outline" className="mt-3 w-full">Back to Orders</Button>
          </Link>
        </motion.div>
      </div>
    </div>
    </PageTransition>
  );
}
