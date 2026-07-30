import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { Warehouse as WarehouseIcon, MapPin, Thermometer, Users, ArrowDownToLine, ArrowUpFromLine, Activity, Gauge, Grid3x3, TrendingUp, Boxes, Ruler, PackagePlus, ClipboardList, Wand2, ChevronRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import { useDataStore } from '@/lib/store';
import { PageTransition } from '@/components/shared/PageTransition';
import { StaggerContainer, StaggerItem } from '@/components/shared/PageTransition';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Order } from '@/lib/types';

const priorityRank: Record<Order['priority'], number> = { urgent: 0, high: 1, medium: 2, low: 3 };
const shippingStatusLabel: Record<string, string> = { pending: 'Pending Pick', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

const movementData = [
  { day: 'Mon', incoming: 320, outgoing: 280 },
  { day: 'Tue', incoming: 450, outgoing: 380 },
  { day: 'Wed', incoming: 380, outgoing: 420 },
  { day: 'Thu', incoming: 520, outgoing: 390 },
  { day: 'Fri', incoming: 680, outgoing: 510 },
  { day: 'Sat', incoming: 240, outgoing: 180 },
  { day: 'Sun', incoming: 180, outgoing: 120 },
];

function heatColor(value: number) {
  if (value >= 90) return 'bg-red-500/80';
  if (value >= 75) return 'bg-orange-500/70';
  if (value >= 60) return 'bg-amber-500/60';
  if (value >= 40) return 'bg-emerald-500/50';
  return 'bg-blue-500/40';
}

export default function WarehousePage() {
  const warehouses = useDataStore((s) => s.warehouses);
  const products = useDataStore((s) => s.products);
  const orders = useDataStore((s) => s.orders);
  const addStock = useDataStore((s) => s.addStock);
  const simulateLiveTick = useDataStore((s) => s.simulateLiveTick);
  const fulfillOrder = useDataStore((s) => s.fulfillOrder);
  const [selectedId, setSelectedId] = useState(warehouses[0]?.id);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selected = warehouses.find((w) => w.id === selectedId) || warehouses[0];
  const warehouseUtilization = useMemo(
    () => warehouses.map((w) => ({ name: w.name, used: w.used, capacity: w.capacity, pct: Math.round((w.used / w.capacity) * 100) })),
    [warehouses]
  );
  const warehouseProducts = useMemo(() => products.filter((p) => p.warehouse === selected?.id), [products, selected]);
  const sortedZones = useMemo(
    () => [...(selected?.zones ?? [])].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    [selected]
  );

  // Live mode: periodically nudge warehouse stats to simulate real-time activity
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => simulateLiveTick(), 2500);
    return () => clearInterval(interval);
  }, [isLive, simulateLiveTick]);

  // Orders waiting to be picked/processed at the selected warehouse, ordered by priority then age
  const pendingOrders = useMemo(() => {
    return orders
      .filter((o) => o.warehouse === selected?.id && (o.shippingStatus === 'pending' || o.shippingStatus === 'processing'))
      .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || a.date.localeCompare(b.date));
  }, [orders, selected]);

  useEffect(() => {
    if (selectedOrderId && !pendingOrders.some((o) => o.id === selectedOrderId)) {
      setSelectedOrderId(null);
    }
  }, [pendingOrders, selectedOrderId]);

  const handleAutoSelect = () => {
    if (pendingOrders.length === 0) {
      toast.info('No pending orders at this warehouse.');
      return;
    }
    const next = pendingOrders[0];
    setSelectedOrderId(next.id);
    toast.success(`Auto-selected ${next.id} (${next.priority} priority)`);
  };

  const handleAdvanceOrder = () => {
    if (!selectedOrderId) {
      toast.error('Select an order first, or use Auto-Select.');
      return;
    }
    const order = pendingOrders.find((o) => o.id === selectedOrderId);
    if (!order) return;
    fulfillOrder(order.id);
    toast.success(`${order.id} moved to ${order.shippingStatus === 'pending' ? 'processing' : 'shipped'}`);
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouse</h1>
          <p className="text-sm text-muted-foreground">Monitor storage capacity, rack utilization, and inventory movement</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLive((v) => !v)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              isLive ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-border/50 bg-card/40 text-muted-foreground'
            )}
            title={isLive ? 'Live updates on — click to pause' : 'Live updates paused — click to resume'}
          >
            <span className="relative flex h-2 w-2">
              {isLive && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
              <span className={cn('relative inline-flex h-2 w-2 rounded-full', isLive ? 'bg-emerald-400' : 'bg-muted-foreground')} />
            </span>
            {isLive ? 'Live' : 'Paused'}
          </button>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
            <SelectContent>
              {warehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.id} · {w.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setStockDialogOpen(true)} className="gap-2">
            <PackagePlus className="h-4 w-4" /> Add Stock
          </Button>
        </div>
      </div>

      {/* Warehouse Cards */}
      <StaggerContainer className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {warehouses.map((wh) => {
          const pct = Math.round((wh.used / wh.capacity) * 100);
          const isActive = selected.id === wh.id;
          return (
            <StaggerItem key={wh.id}>
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setSelectedId(wh.id)}
                className={cn(
                  'gradient-border glow-hover cursor-pointer rounded-2xl p-5 transition-all',
                  isActive && 'ring-2 ring-primary/50'
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-lg shadow-primary/20">
                      <WarehouseIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{wh.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {wh.location}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Capacity Used</span>
                  <span className={cn('font-bold', pct >= 90 ? 'text-red-400' : pct >= 75 ? 'text-amber-400' : 'text-emerald-400')}>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className={cn('h-full rounded-full', pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500')}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-card/50 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Racks</p>
                    <p className="text-sm font-bold">{wh.racksUsed}/{wh.racks}</p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Staff</p>
                    <p className="text-sm font-bold">{wh.staff}</p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Perf</p>
                    <p className="text-sm font-bold text-emerald-400">{wh.performance}%</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Selected Warehouse Detail */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Capacity Gauge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4 text-primary" /> Capacity Gauge</h3>
          <div className="relative mx-auto h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart data={[{ name: 'Used', value: Math.round((selected.used / selected.capacity) * 100), fill: 'hsl(var(--primary))' }]} innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'hsl(var(--border))' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatedCounter value={Math.round((selected.used / selected.capacity) * 100)} suffix="%" className="text-3xl font-bold" />
              <p className="text-xs text-muted-foreground">{(selected.used / 1000).toFixed(1)}K / {(selected.capacity / 1000).toFixed(0)}K sqft</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <ArrowDownToLine className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
              <p className="text-xs font-bold">{selected.incoming}</p>
              <p className="text-[10px] text-muted-foreground">Incoming</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2">
              <ArrowUpFromLine className="mx-auto mb-1 h-4 w-4 text-blue-400" />
              <p className="text-xs font-bold">{selected.outgoing}</p>
              <p className="text-[10px] text-muted-foreground">Outgoing</p>
            </div>
          </div>
        </motion.div>

        {/* Zone Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Grid3x3 className="h-4 w-4 text-primary" /> Zone Utilization Heatmap</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sortedZones.map((zone, i) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className={cn('rounded-xl p-3 text-white', heatColor(zone.utilization))}
              >
                <p className="text-xs font-semibold leading-tight">{zone.name}</p>
                <p className="mt-2 text-2xl font-bold">{zone.utilization}%</p>
                <p className="text-xs opacity-80">{zone.items} items</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">Scale:</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-8 rounded bg-blue-500/40" /> <span className="text-muted-foreground">&lt;40%</span>
              <span className="h-3 w-8 rounded bg-emerald-500/50" /> <span className="text-muted-foreground">40-60%</span>
              <span className="h-3 w-8 rounded bg-amber-500/60" /> <span className="text-muted-foreground">60-75%</span>
              <span className="h-3 w-8 rounded bg-orange-500/70" /> <span className="text-muted-foreground">75-90%</span>
              <span className="h-3 w-8 rounded bg-red-500/80" /> <span className="text-muted-foreground">90%+</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Orders — pick manually or auto-select */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="gradient-border glow-hover mb-6 rounded-2xl p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold"><ClipboardList className="h-4 w-4 text-primary" /> Pending Orders — {selected?.name}</h3>
            <p className="text-xs text-muted-foreground">Select an order to pick manually, or auto-select the next by priority</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleAutoSelect}>
              <Wand2 className="h-3.5 w-3.5" /> Auto-Select
            </Button>
            <Button size="sm" className="gap-1.5 text-xs" onClick={handleAdvanceOrder} disabled={!selectedOrderId}>
              <PackageCheck className="h-3.5 w-3.5" /> Process Selected
            </Button>
          </div>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/50 p-4 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No pending orders — this warehouse is all caught up.
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {pendingOrders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                const itemCount = order.products.reduce((s, p) => s + p.qty, 0);
                return (
                  <motion.button
                    key={order.id}
                    type="button"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                      isSelected ? 'border-primary/60 bg-primary/5' : 'border-border/50 bg-card/40 hover:border-border'
                    )}
                  >
                    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full border', isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40')}>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-primary">{order.id}</span>
                        <StatusBadge status={order.priority} type="priority" />
                        <StatusBadge status={order.shippingStatus} type="shipping" />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{order.customer} · {itemCount} items · ${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <span className="hidden shrink-0 text-[10px] text-muted-foreground sm:block">{shippingStatusLabel[order.shippingStatus]}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Product Stock Levels */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-border glow-hover mb-6 rounded-2xl p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Boxes className="h-4 w-4 text-primary" /> Stock Levels — {selected?.name}</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {warehouseProducts.map((p) => {
            const low = p.stock <= p.reorderLevel;
            return (
              <div key={p.id} className={cn('rounded-xl border p-3', low ? 'border-red-500/40 bg-red-500/5' : 'border-border/50 bg-card/40')}>
                <p className="text-xs font-medium leading-tight">{p.name}</p>
                <p className="mt-1 text-lg font-bold">{p.stock} <span className="text-xs font-normal text-muted-foreground">units</span></p>
                <p className={cn('text-[10px]', low ? 'text-red-400' : 'text-muted-foreground')}>{low ? 'Below reorder level' : `Reorder at ${p.reorderLevel}`}</p>
              </div>
            );
          })}
          {warehouseProducts.length === 0 && (
            <p className="text-xs text-muted-foreground">No products assigned to this warehouse.</p>
          )}
        </div>
      </motion.div>

      {/* Inventory Movement + Rack Utilization */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border glow-hover rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-primary" /> Inventory Movement</h3>
              <p className="text-xs text-muted-foreground">Incoming vs outgoing this week</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> In</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /> Out</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={movementData}>
              <defs>
                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="incoming" stroke="hsl(142 71% 45%)" strokeWidth={2} fill="url(#inGrad)" />
              <Area type="monotone" dataKey="outgoing" stroke="hsl(199 89% 48%)" strokeWidth={2} fill="url(#outGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border glow-hover rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Ruler className="h-4 w-4 text-primary" /> Rack Utilization</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={warehouseUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {warehouseUtilization.map((entry, i) => (
                  <Cell key={i} fill={entry.pct >= 90 ? 'hsl(0 72% 51%)' : entry.pct >= 75 ? 'hsl(38 92% 50%)' : 'hsl(142 71% 45%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Stats Row */}
      <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem>
          <div className="gradient-border glow-hover rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Thermometer className="h-4 w-4 text-chart-3" /> Temperature</div>
            <AnimatedCounter value={selected.temperature} suffix="°C" className="mt-1 block text-xl font-bold" />
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="gradient-border glow-hover rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-4 w-4 text-chart-2" /> Staff</div>
            <AnimatedCounter value={selected.staff} className="mt-1 block text-xl font-bold" />
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="gradient-border glow-hover rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Boxes className="h-4 w-4 text-chart-1" /> Total Items</div>
            <AnimatedCounter value={selected.zones.reduce((s, z) => s + z.items, 0)} className="mt-1 block text-xl font-bold" />
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="gradient-border glow-hover rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-4 w-4 text-emerald-400" /> Performance</div>
            <AnimatedCounter value={selected.performance} suffix="%" className="mt-1 block text-xl font-bold text-emerald-400" />
          </div>
        </StaggerItem>
      </StaggerContainer>

      <AddStockDialog open={stockDialogOpen} onClose={() => setStockDialogOpen(false)} products={products} onAdd={addStock} />
    </PageTransition>
  );
}

function AddStockDialog({ open, onClose, products, onAdd }: {
  open: boolean; onClose: () => void;
  products: { id: string; name: string; stock: number; warehouse: string }[];
  onAdd: (productId: string, qty: number) => void;
}) {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(50);

  const handleSubmit = () => {
    if (!productId || qty <= 0) {
      toast.error('Choose a product and a quantity greater than 0.');
      return;
    }
    const product = products.find((p) => p.id === productId);
    onAdd(productId, qty);
    toast.success(`Added ${qty} units of ${product?.name} — warehouse and reports updated`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><PackagePlus className="h-5 w-5 text-primary" /> Add Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs">Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Quantity to Add</Label>
            <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
