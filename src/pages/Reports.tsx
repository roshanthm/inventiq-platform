import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, Download, FileSpreadsheet, FileImage, Printer, TrendingUp, Package, DollarSign, AlertTriangle, Boxes, Calendar } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { monthlyRevenue, ordersTrend, inventoryTrend, categoryDistribution, topSellingProducts } from '@/lib/data';
import { useDataStore } from '@/lib/store';
import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const lowStockProducts = (products: Product[]) => products.filter((p) => p.stock < p.reorderLevel);

export default function Reports() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const orders = useDataStore((s) => s.orders);
  const products = useDataStore((s) => s.products);
  const warehouses = useDataStore((s) => s.warehouses);

  const lowStock = lowStockProducts(products);
  const totalRevenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(orders.reduce((s, o) => s + o.totalAmount, 0) / totalOrders) : 0;
  const warehouseUtilization = warehouses.map((w) => ({ name: w.name, used: w.used, capacity: w.capacity, pct: Math.round((w.used / w.capacity) * 100) }));
  const completed = orders.filter((o) => o.shippingStatus === 'delivered').length;
  const inTransit = orders.filter((o) => ['shipped', 'processing', 'pending'].includes(o.shippingStatus)).length;
  const cancelled = orders.filter((o) => o.shippingStatus === 'cancelled').length;

  const handleExport = (format: string) => {
    toast.success(`Exporting report as ${format}...`);
  };

  const quarterlyData = [
    { period: 'Q1', revenue: 4140000, orders: 890, inventory: 128000 },
    { period: 'Q2', revenue: 4940000, orders: 1020, inventory: 137000 },
    { period: 'Q3', revenue: 5634000, orders: 1180, inventory: 152300 },
    { period: 'Q4', revenue: 6210000, orders: 1340, inventory: 164000 },
  ];

  const yearlyData = [
    { year: '2022', revenue: 14200000, orders: 4200, inventory: 98000 },
    { year: '2023', revenue: 16800000, orders: 4800, inventory: 112000 },
    { year: '2024', revenue: 18900000, orders: 5400, inventory: 125000 },
    { year: '2025', revenue: 20924000, orders: 6100, inventory: 152300 },
    { year: '2026', revenue: 12504000, orders: 3650, inventory: 152300 },
  ];

  const currentData = period === 'monthly' ? monthlyRevenue.map((m) => ({ name: m.month, revenue: m.revenue, target: m.target })) :
    period === 'quarterly' ? quarterlyData.map((q) => ({ name: q.period, revenue: q.revenue, target: q.revenue * 0.85 })) :
    yearlyData.map((y) => ({ name: y.year, revenue: y.revenue, target: y.revenue * 0.8 }));

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Executive analytics and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="gap-1.5"><FileText className="h-4 w-4" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')} className="gap-1.5"><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} className="gap-1.5"><Download className="h-4 w-4" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Print')} className="gap-1.5"><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: Math.round(totalRevenue), prefix: '$', icon: DollarSign, color: 'hsl(var(--chart-1))' },
          { label: 'Total Orders', value: totalOrders, icon: Package, color: 'hsl(var(--chart-2))' },
          { label: 'Avg Order Value', value: avgOrderValue, prefix: '$', icon: TrendingUp, color: 'hsl(var(--chart-3))' },
          { label: 'Low Stock Items', value: lowStock.length, icon: AlertTriangle, color: 'hsl(var(--chart-5))' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gradient-border glow-hover rounded-2xl p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg glass" style={{ color: kpi.color }}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <AnimatedCounter value={kpi.value} prefix={kpi.prefix || ''} className="text-xl font-bold" />
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="glass flex h-auto flex-wrap gap-1 rounded-2xl p-1.5">
          <TabsTrigger value="inventory" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Inventory</TabsTrigger>
          <TabsTrigger value="warehouse" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Warehouse</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Orders</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Revenue</TabsTrigger>
        </TabsList>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Boxes className="h-4 w-4 text-primary" /> Inventory Trend (Area)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={inventoryTrend}>
                  <defs>
                    <linearGradient id="repInv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#repInv)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4 text-primary" /> Category Distribution (Pie)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name}: ${entry.value}%`}>
                    {categoryDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Low Stock Report */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-amber-400" /> Low Stock Report</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-4 font-semibold">Product</th>
                    <th className="pb-2 pr-4 font-semibold">SKU</th>
                    <th className="pb-2 pr-4 font-semibold">Stock</th>
                    <th className="pb-2 pr-4 font-semibold">Reorder Level</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((p, i) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/30">
                      <td className="py-2.5 pr-4 text-sm font-medium">{p.name}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{p.sku}</td>
                      <td className="py-2.5 pr-4 text-sm font-semibold text-red-400">{p.stock}</td>
                      <td className="py-2.5 pr-4 text-sm text-muted-foreground">{p.reorderLevel}</td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400">Critical</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>

        {/* Warehouse Report */}
        <TabsContent value="warehouse" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4 text-primary" /> Warehouse Utilization (Bar)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={warehouseUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="pct" name="Utilization %" radius={[4, 4, 0, 0]}>
                    {warehouseUtilization.map((entry, i) => (
                      <Cell key={i} fill={entry.pct >= 90 ? 'hsl(0 72% 51%)' : entry.pct >= 75 ? 'hsl(38 92% 50%)' : 'hsl(142 71% 45%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Capacity vs Used (Line)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={warehouseUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="used" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Used" />
                  <Line type="monotone" dataKey="capacity" stroke="hsl(var(--chart-4))" strokeWidth={2} strokeDasharray="5 5" name="Capacity" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </TabsContent>

        {/* Orders Report */}
        <TabsContent value="orders" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Package className="h-4 w-4 text-primary" /> Weekly Orders & Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={ordersTrend}>
                <defs>
                  <linearGradient id="repOrd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#repOrd)" name="Orders" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#repRev)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Selling */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border rounded-2xl p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topSellingProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={140} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                  {topSellingProducts.map((_, i) => (
                    <Cell key={i} fill={`hsl(${199 + i * 30} 80% 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>

        {/* Revenue Report */}
        <TabsContent value="revenue" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold"><DollarSign className="h-4 w-4 text-primary" /> Revenue Overview</h3>
              <div className="flex items-center gap-1.5 rounded-xl glass p-1">
                {(['monthly', 'quarterly', 'yearly'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all',
                      period === p ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Calendar className="h-3 w-3" /> {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData}>
                <defs>
                  <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" fill="url(#revBar)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="target" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} opacity={0.4} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Revenue Trend (Line)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ fill: 'hsl(var(--chart-1))', r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-4))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Order Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Orders', value: totalOrders.toLocaleString(), change: 'live', up: true },
                  { label: 'Completed', value: completed.toLocaleString(), change: totalOrders ? `${Math.round((completed / totalOrders) * 100)}%` : '0%', up: true },
                  { label: 'In Transit', value: inTransit.toLocaleString(), change: totalOrders ? `${Math.round((inTransit / totalOrders) * 100)}%` : '0%', up: true },
                  { label: 'Cancelled', value: cancelled.toLocaleString(), change: totalOrders ? `${Math.round((cancelled / totalOrders) * 100)}%` : '0%', up: false },
                ].map((row, i) => (
                  <motion.div key={row.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{row.value}</span>
                      <span className={cn('text-xs font-medium', row.up ? 'text-emerald-400' : 'text-red-400')}>{row.change}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
