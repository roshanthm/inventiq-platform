import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, Boxes, DollarSign, Package, TrendingUp, Warehouse, Zap, Brain, Clock, Truck, ShoppingCart, PackageCheck, BarChart3 } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, Line, LineChart } from 'recharts';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { KPICard } from '@/components/shared/KPICard';
import { StaggerContainer, StaggerItem, PageTransition } from '@/components/shared/PageTransition';
import { inventoryTrend, ordersTrend, monthlyRevenue, categoryDistribution, aiInsights, topSellingProducts } from '@/lib/data';
import { useDataStore } from '@/lib/store';
import { Link } from 'react-router-dom';

const insightConfig = {
  restock: { icon: AlertTriangle, color: 'hsl(0 72% 51%)', bg: 'bg-red-500/10' },
  overstock: { icon: Boxes, color: 'hsl(38 92% 50%)', bg: 'bg-amber-500/10' },
  capacity: { icon: Warehouse, color: 'hsl(199 89% 48%)', bg: 'bg-blue-500/10' },
  demand: { icon: TrendingUp, color: 'hsl(142 71% 45%)', bg: 'bg-emerald-500/10' },
  anomaly: { icon: Zap, color: 'hsl(280 65% 65%)', bg: 'bg-violet-500/10' },
};

const severityBorder: Record<string, string> = {
  critical: 'border-red-500/40',
  warning: 'border-amber-500/40',
  info: 'border-blue-500/40',
};

const activityIcon = {
  order: { icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  stock: { icon: PackageCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  shipment: { icon: Truck, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  system: { icon: Brain, color: 'text-primary', bg: 'bg-primary/10' },
};

export default function Dashboard() {
  const orders = useDataStore((s) => s.orders);
  const products = useDataStore((s) => s.products);
  const warehouses = useDataStore((s) => s.warehouses);
  const activities = useDataStore((s) => s.activities);

  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.shippingStatus)).length;
  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
  const totalUsed = warehouses.reduce((s, w) => s + w.used, 0);
  const capacityPct = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;
  const pendingShipments = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.shippingStatus)).length;

  return (
    <PageTransition>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-border relative mb-6 overflow-hidden rounded-2xl p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-chart-4/15 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Operations Overview
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
              Real-time inventory, order, and warehouse performance across all facilities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-center backdrop-blur-xl">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Health Score</p>
              <div className="relative mt-1 h-20 w-20">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                  <motion.circle
                    cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={201}
                    initial={{ strokeDashoffset: 201 }}
                    animate={{ strokeDashoffset: 201 - (201 * 87) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">87</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <StaggerContainer className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <KPICard title="Inventory Value" icon={<DollarSign className="h-4 w-4" />} accent="hsl(var(--chart-1))">
            <div className="flex items-end justify-between">
              <AnimatedCounter value={Math.round(inventoryValue)} prefix="$" className="text-2xl font-bold" />
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <ArrowUpRight className="h-3 w-3" /> live
              </span>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inventoryTrend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </KPICard>
        </StaggerItem>

        <StaggerItem>
          <KPICard title="Active Orders" icon={<Package className="h-4 w-4" />} accent="hsl(var(--chart-2))">
            <div className="flex items-end justify-between">
              <AnimatedCounter value={activeOrders} className="text-2xl font-bold" />
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <ArrowUpRight className="h-3 w-3" /> live
              </span>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersTrend}>
                  <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </KPICard>
        </StaggerItem>

        <StaggerItem>
          <KPICard title="Warehouse Capacity" icon={<Warehouse className="h-4 w-4" />} accent="hsl(var(--chart-3))">
            <div className="flex items-end justify-between">
              <AnimatedCounter value={capacityPct} suffix="%" className="text-2xl font-bold" />
              <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                <ArrowUpRight className="h-3 w-3" /> live
              </span>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart data={[{ value: capacityPct, fill: 'hsl(var(--chart-3))' }]} innerRadius="60%" outerRadius="100%" startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'hsl(var(--border))' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </KPICard>
        </StaggerItem>

        <StaggerItem>
          <KPICard title="Pending Shipments" icon={<Truck className="h-4 w-4" />} accent="hsl(var(--chart-4))">
            <div className="flex items-end justify-between">
              <AnimatedCounter value={pendingShipments} className="text-2xl font-bold" />
              <span className="flex items-center gap-1 text-xs font-medium text-red-400">
                <ArrowDownRight className="h-3 w-3" /> live
              </span>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersTrend}>
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </KPICard>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-border glow-hover rounded-2xl p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Inventory Trend</h3>
              <p className="text-xs text-muted-foreground">Units over time vs capacity</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-1" /> Value</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Capacity</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inventoryTrend}>
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#invGrad)" />
              <Area type="monotone" dataKey="capacity" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="gradient-border glow-hover rounded-2xl p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Monthly Revenue</h3>
              <p className="text-xs text-muted-foreground">Revenue vs target</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-1" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-4" /> Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Insights + Activity */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">AI Insights</h3>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">{aiInsights.length} active</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {aiInsights.map((insight, i) => {
              const cfg = insightConfig[insight.type];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className={`glass rounded-xl border ${severityBorder[insight.severity]} p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <cfg.icon className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{insight.title}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{insight.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Confidence</span>
                            <span>{insight.confidence}%</span>
                          </div>
                          <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-border">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: cfg.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${insight.confidence}%` }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.08 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">Live Activity</h3>
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="glass rounded-2xl p-2">
            <div className="relative">
              {activities.map((act, i) => {
                const cfg = activityIcon[act.type];
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="relative flex gap-3 px-3 py-2.5"
                  >
                    {i < activities.length - 1 && (
                      <div className="absolute left-[26px] top-12 h-[calc(100%-2rem)] w-px bg-border" />
                    )}
                    <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-xs leading-snug">{act.message}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" /> {act.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Orders Trend + Category + Top Products */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-border glow-hover rounded-2xl p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Orders Trend</h3>
              <p className="text-xs text-muted-foreground">Weekly order volume</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ordersTrend}>
              <defs>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#ordGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="gradient-border glow-hover rounded-2xl p-5"
        >
          <h3 className="mb-4 text-sm font-semibold">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="gradient-border glow-hover rounded-2xl p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Orders</h3>
            <Link to="/orders" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {order.customer.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden text-sm font-semibold sm:block">${order.totalAmount.toLocaleString()}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    order.shippingStatus === 'delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                    order.shippingStatus === 'shipped' ? 'bg-blue-500/15 text-blue-400' :
                    order.shippingStatus === 'processing' ? 'bg-violet-500/15 text-violet-400' :
                    order.shippingStatus === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                    'bg-amber-500/15 text-amber-400'
                  }`}>{order.shippingStatus}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Order', icon: ShoppingCart, to: '/orders', color: 'hsl(var(--chart-1))' },
              { label: 'Add Stock', icon: Package, to: '/warehouse', color: 'hsl(var(--chart-2))' },
              { label: 'View Reports', icon: BarChart3, to: '/reports', color: 'hsl(var(--chart-3))' },
              { label: 'Warehouses', icon: Warehouse, to: '/warehouse', color: 'hsl(var(--chart-4))' },
            ].map((action, i) => (
              <motion.div key={action.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 + i * 0.05 }}>
                <Link to={action.to}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass glow-hover flex h-full flex-col items-center justify-center gap-2 rounded-xl p-4 text-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${action.color}15`, color: action.color }}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 glass rounded-2xl p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Selling</h4>
            <div className="space-y-2">
              {topSellingProducts.slice(0, 3).map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    <span className="text-xs font-medium">{p.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">${(p.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
