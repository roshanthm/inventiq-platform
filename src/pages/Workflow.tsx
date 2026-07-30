import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  CreditCard,
  PackageCheck,
  Truck,
  MapPin,
  CheckCircle2,
  Boxes,
  AlertTriangle,
  Warehouse as WarehouseIcon,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Lightbulb,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const orderSteps = [
  {
    num: 1,
    icon: ShoppingCart,
    title: 'Order Placed',
    desc: 'A customer submits a purchase order for one or more products from a specific warehouse.',
    color: 'text-chart-1',
    bg: 'bg-chart-1/10',
    ring: 'ring-chart-1/30',
  },
  {
    num: 2,
    icon: CreditCard,
    title: 'Payment Confirmed',
    desc: 'The system verifies the payment. If payment fails, the order is held until the customer retries.',
    color: 'text-chart-2',
    bg: 'bg-chart-2/10',
    ring: 'ring-chart-2/30',
  },
  {
    num: 3,
    icon: PackageCheck,
    title: 'Processing',
    desc: 'Warehouse staff pick the items from their assigned zones, pack them, and prepare the shipment.',
    color: 'text-chart-3',
    bg: 'bg-chart-3/10',
    ring: 'ring-chart-3/30',
  },
  {
    num: 4,
    icon: Truck,
    title: 'Shipped',
    desc: 'The packed order leaves the warehouse and is handed to the shipping carrier.',
    color: 'text-chart-4',
    bg: 'bg-chart-4/10',
    ring: 'ring-chart-4/30',
  },
  {
    num: 5,
    icon: MapPin,
    title: 'Out for Delivery',
    desc: 'The carrier delivers the package to the customer address. Tracking updates in real time.',
    color: 'text-chart-5',
    bg: 'bg-chart-5/10',
    ring: 'ring-chart-5/30',
  },
  {
    num: 6,
    icon: CheckCircle2,
    title: 'Delivered',
    desc: 'The customer receives the order. Stock levels are automatically reduced in the warehouse.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    ring: 'ring-primary/30',
  },
];

const inventorySteps = [
  {
    icon: Boxes,
    title: 'Stock Monitoring',
    desc: 'Each product has a current stock count and a reorder level. The dashboard tracks both in real time.',
  },
  {
    icon: AlertTriangle,
    title: 'Low-Stock Alert',
    desc: 'When stock drops below the reorder level, the system flags the product as critical and notifies the team.',
  },
  {
    icon: TrendingUp,
    title: 'Restock & Replenish',
    desc: 'New inventory is ordered from suppliers and received into the warehouse, raising stock back to safe levels.',
  },
  {
    icon: WarehouseIcon,
    title: 'Capacity Management',
    desc: 'Each warehouse tracks used vs. total capacity. If a warehouse nears its limit, goods are rerouted to another.',
  },
];

const keyTakeaways = [
  'Every order moves through six stages — placed, paid, processed, shipped, out for delivery, delivered.',
  'If payment fails, the order pauses at step 2 and waits for the customer to retry.',
  'Stock is reduced automatically when an order is delivered, which can trigger a low-stock alert.',
  'Three warehouses (North Distribution Center, South Distribution Center, East Distribution Center) share the load and balance capacity.',
];

export default function Workflow() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <GraduationCap className="h-3.5 w-3.5" />
          Student Guide
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          How the Inventory System Works
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A visual walkthrough of the end-to-end workflow — from the moment a customer
          places an order to the moment it arrives at their door, plus how stock is
          kept healthy behind the scenes.
        </p>
      </motion.div>

      {/* Order lifecycle */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10"
      >
        <div className="mb-5 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Order Lifecycle</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderSteps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className={cn(
                'relative rounded-2xl border border-border/60 bg-card/60 p-5 ring-1 backdrop-blur-xl transition-colors',
                step.ring
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', step.bg)}>
                  <step.icon className={cn('h-5.5 w-5.5', step.color)} />
                </div>
                <span className="text-3xl font-black text-muted-foreground/20">
                  {step.num}
                </span>
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
              {i < orderSteps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground/40 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Inventory management */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        <div className="mb-5 flex items-center gap-2">
          <Boxes className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Inventory Management</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inventorySteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Key takeaways */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-10"
      >
        <div className="mb-5 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Key Takeaways</h2>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
          <ul className="space-y-3">
            {keyTakeaways.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
                className="flex items-start gap-3 text-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-muted-foreground">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:flex-row"
      >
        <div>
          <h3 className="text-sm font-semibold">Ready to explore the live system?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Jump into the dashboard to see real orders, stock levels, and warehouse data.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
