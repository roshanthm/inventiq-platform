import type { Order, Warehouse, Product, Activity, AIInsight } from './types';

export const products: Product[] = [
  { id: 'P-001', name: 'Handheld Barcode Scanner', sku: 'BSC-1001', category: 'Electronics', stock: 1240, reorderLevel: 300, price: 249.99, warehouse: 'WH-A', trend: [800, 950, 1100, 1050, 1240] },
  { id: 'P-002', name: 'Rugged Tablet POS', sku: 'TPS-1002', category: 'Electronics', stock: 85, reorderLevel: 200, price: 1299.0, warehouse: 'WH-A', trend: [300, 250, 200, 150, 85] },
  { id: 'P-003', name: 'Forklift Battery Pack', sku: 'FBP-1003', category: 'Energy', stock: 540, reorderLevel: 150, price: 459.5, warehouse: 'WH-B', trend: [200, 300, 400, 480, 540] },
  { id: 'P-004', name: 'LED Warehouse Display', sku: 'LWD-1004', category: 'Displays', stock: 320, reorderLevel: 100, price: 899.0, warehouse: 'WH-B', trend: [150, 200, 250, 300, 320] },
  { id: 'P-005', name: 'Industrial Network Switch', sku: 'INS-1005', category: 'Networking', stock: 42, reorderLevel: 100, price: 179.99, warehouse: 'WH-C', trend: [200, 150, 100, 80, 42] },
  { id: 'P-006', name: 'Backup Power Unit', sku: 'BPU-1006', category: 'Energy', stock: 890, reorderLevel: 250, price: 749.0, warehouse: 'WH-A', trend: [600, 700, 750, 820, 890] },
  { id: 'P-007', name: 'Warehouse Robot Kit', sku: 'WRK-1007', category: 'Robotics', stock: 156, reorderLevel: 80, price: 329.0, warehouse: 'WH-C', trend: [100, 110, 130, 145, 156] },
  { id: 'P-008', name: 'Fiber Optic Cable Spool', sku: 'FOC-1008', category: 'Networking', stock: 2100, reorderLevel: 500, price: 89.99, warehouse: 'WH-B', trend: [1500, 1700, 1900, 2000, 2100] },
];

export const orders: Order[] = [
  {
    id: 'ORD-7841', customer: 'Aurora Technologies', customerEmail: 'procurement@auroratech.io',
    products: [{ name: 'Handheld Barcode Scanner', qty: 24, price: 249.99 }, { name: 'Fiber Optic Cable Spool', qty: 100, price: 89.99 }],
    warehouse: 'WH-A', date: '2026-07-28', paymentStatus: 'paid', shippingStatus: 'shipped', priority: 'high', totalAmount: 14999.76,
    timeline: [
      { status: 'Order Placed', date: '2026-07-26', done: true },
      { status: 'Payment Confirmed', date: '2026-07-26', done: true },
      { status: 'Processing', date: '2026-07-27', done: true },
      { status: 'Shipped', date: '2026-07-28', done: true },
      { status: 'Out for Delivery', date: '2026-07-30', done: false },
      { status: 'Delivered', date: '2026-07-31', done: false },
    ],
  },
  {
    id: 'ORD-7842', customer: 'Helix Industries', customerEmail: 'orders@helixind.com',
    products: [{ name: 'Rugged Tablet POS', qty: 5, price: 1299.0 }],
    warehouse: 'WH-A', date: '2026-07-28', paymentStatus: 'pending', shippingStatus: 'processing', priority: 'urgent', totalAmount: 6495.0,
    timeline: [
      { status: 'Order Placed', date: '2026-07-28', done: true },
      { status: 'Payment Confirmed', date: '2026-07-28', done: false },
      { status: 'Processing', date: '2026-07-29', done: false },
      { status: 'Shipped', date: '2026-07-30', done: false },
      { status: 'Delivered', date: '2026-08-01', done: false },
    ],
  },
  {
    id: 'ORD-7843', customer: 'Vertex Global', customerEmail: 'supply@vertexglobal.co',
    products: [{ name: 'Forklift Battery Pack', qty: 12, price: 459.5 }, { name: 'Backup Power Unit', qty: 8, price: 749.0 }],
    warehouse: 'WH-B', date: '2026-07-27', paymentStatus: 'paid', shippingStatus: 'delivered', priority: 'medium', totalAmount: 11390.0,
    timeline: [
      { status: 'Order Placed', date: '2026-07-24', done: true },
      { status: 'Payment Confirmed', date: '2026-07-24', done: true },
      { status: 'Processing', date: '2026-07-25', done: true },
      { status: 'Shipped', date: '2026-07-26', done: true },
      { status: 'Delivered', date: '2026-07-27', done: true },
    ],
  },
  {
    id: 'ORD-7844', customer: 'Nimbus Systems', customerEmail: 'po@nimbussys.io',
    products: [{ name: 'LED Warehouse Display', qty: 6, price: 899.0 }],
    warehouse: 'WH-B', date: '2026-07-27', paymentStatus: 'paid', shippingStatus: 'pending', priority: 'low', totalAmount: 5394.0,
    timeline: [
      { status: 'Order Placed', date: '2026-07-27', done: true },
      { status: 'Payment Confirmed', date: '2026-07-27', done: true },
      { status: 'Processing', date: '2026-07-28', done: false },
      { status: 'Shipped', date: '2026-07-29', done: false },
      { status: 'Delivered', date: '2026-07-31', done: false },
    ],
  },
  {
    id: 'ORD-7845', customer: 'Zenith Corp', customerEmail: 'orders@zenithcorp.com',
    products: [{ name: 'Industrial Network Switch', qty: 20, price: 179.99 }, { name: 'Warehouse Robot Kit', qty: 10, price: 329.0 }],
    warehouse: 'WH-C', date: '2026-07-26', paymentStatus: 'refunded', shippingStatus: 'cancelled', priority: 'medium', totalAmount: 6889.8,
    timeline: [
      { status: 'Order Placed', date: '2026-07-25', done: true },
      { status: 'Payment Confirmed', date: '2026-07-25', done: true },
      { status: 'Cancelled', date: '2026-07-26', done: true },
    ],
  },
  {
    id: 'ORD-7846', customer: 'Pinnacle Labs', customerEmail: 'buy@pinnaclerlabs.ai',
    products: [{ name: 'Handheld Barcode Scanner', qty: 50, price: 249.99 }],
    warehouse: 'WH-A', date: '2026-07-25', paymentStatus: 'paid', shippingStatus: 'delivered', priority: 'high', totalAmount: 12499.5,
    timeline: [
      { status: 'Order Placed', date: '2026-07-22', done: true },
      { status: 'Payment Confirmed', date: '2026-07-22', done: true },
      { status: 'Processing', date: '2026-07-23', done: true },
      { status: 'Shipped', date: '2026-07-24', done: true },
      { status: 'Delivered', date: '2026-07-25', done: true },
    ],
  },
  {
    id: 'ORD-7847', customer: 'Orbit Dynamics', customerEmail: 'procure@orbitdyn.io',
    products: [{ name: 'Fiber Optic Cable Spool', qty: 200, price: 89.99 }, { name: 'Backup Power Unit', qty: 15, price: 749.0 }],
    warehouse: 'WH-B', date: '2026-07-24', paymentStatus: 'paid', shippingStatus: 'shipped', priority: 'high', totalAmount: 29273.0,
    timeline: [
      { status: 'Order Placed', date: '2026-07-22', done: true },
      { status: 'Payment Confirmed', date: '2026-07-22', done: true },
      { status: 'Processing', date: '2026-07-23', done: true },
      { status: 'Shipped', date: '2026-07-24', done: true },
      { status: 'Out for Delivery', date: '2026-07-29', done: false },
      { status: 'Delivered', date: '2026-07-30', done: false },
    ],
  },
  {
    id: 'ORD-7848', customer: 'Spectra Networks', customerEmail: 'orders@spectranet.co',
    products: [{ name: 'Industrial Network Switch', qty: 30, price: 179.99 }],
    warehouse: 'WH-C', date: '2026-07-23', paymentStatus: 'pending', shippingStatus: 'processing', priority: 'medium', totalAmount: 5399.7,
    timeline: [
      { status: 'Order Placed', date: '2026-07-23', done: true },
      { status: 'Payment Confirmed', date: '2026-07-24', done: false },
      { status: 'Processing', date: '2026-07-25', done: false },
      { status: 'Shipped', date: '2026-07-27', done: false },
      { status: 'Delivered', date: '2026-07-29', done: false },
    ],
  },
  {
    id: 'ORD-7849', customer: 'Apex Manufacturing', customerEmail: 'supply@apexmfg.com',
    products: [{ name: 'Forklift Battery Pack', qty: 20, price: 459.5 }, { name: 'LED Warehouse Display', qty: 4, price: 899.0 }],
    warehouse: 'WH-B', date: '2026-07-22', paymentStatus: 'paid', shippingStatus: 'delivered', priority: 'low', totalAmount: 12750.0,
    timeline: [
      { status: 'Order Placed', date: '2026-07-19', done: true },
      { status: 'Payment Confirmed', date: '2026-07-19', done: true },
      { status: 'Processing', date: '2026-07-20', done: true },
      { status: 'Shipped', date: '2026-07-21', done: true },
      { status: 'Delivered', date: '2026-07-22', done: true },
    ],
  },
  {
    id: 'ORD-7850', customer: 'Lumina Tech', customerEmail: 'po@luminatech.io',
    products: [{ name: 'Rugged Tablet POS', qty: 10, price: 1299.0 }, { name: 'Handheld Barcode Scanner', qty: 30, price: 249.99 }],
    warehouse: 'WH-A', date: '2026-07-21', paymentStatus: 'failed', shippingStatus: 'pending', priority: 'urgent', totalAmount: 20499.7,
    timeline: [
      { status: 'Order Placed', date: '2026-07-21', done: true },
      { status: 'Payment Failed', date: '2026-07-21', done: true },
      { status: 'Awaiting Payment', date: '2026-07-22', done: false },
    ],
  },
  {
    id: 'ORD-7851', customer: 'Cascade Robotics', customerEmail: 'orders@cascaderobo.ai',
    products: [{ name: 'Warehouse Robot Kit', qty: 25, price: 329.0 }],
    warehouse: 'WH-C', date: '2026-07-20', paymentStatus: 'paid', shippingStatus: 'shipped', priority: 'high', totalAmount: 8225.0,
    timeline: [
      { status: 'Order Placed', date: '2026-07-18', done: true },
      { status: 'Payment Confirmed', date: '2026-07-18', done: true },
      { status: 'Processing', date: '2026-07-19', done: true },
      { status: 'Shipped', date: '2026-07-20', done: true },
      { status: 'Out for Delivery', date: '2026-07-29', done: false },
      { status: 'Delivered', date: '2026-07-30', done: false },
    ],
  },
  {
    id: 'ORD-7852', customer: 'Stellar Components', customerEmail: 'procure@stellarcomp.com',
    products: [{ name: 'Backup Power Unit', qty: 20, price: 749.0 }, { name: 'Fiber Optic Cable Spool', qty: 150, price: 89.99 }],
    warehouse: 'WH-B', date: '2026-07-19', paymentStatus: 'paid', shippingStatus: 'delivered', priority: 'medium', totalAmount: 28498.5,
    timeline: [
      { status: 'Order Placed', date: '2026-07-16', done: true },
      { status: 'Payment Confirmed', date: '2026-07-16', done: true },
      { status: 'Processing', date: '2026-07-17', done: true },
      { status: 'Shipped', date: '2026-07-18', done: true },
      { status: 'Delivered', date: '2026-07-19', done: true },
    ],
  },
];

export const warehouses: Warehouse[] = [
  {
    id: 'WH-A', name: 'North Distribution Center', location: 'San Francisco, CA', capacity: 50000, used: 38500, racks: 240, racksUsed: 198,
    incoming: 1200, outgoing: 890, temperature: 18, staff: 42, performance: 94,
    zones: [
      { name: 'Zone A1 - Electronics', utilization: 82, items: 1240 },
      { name: 'Zone A2 - Processors', utilization: 95, items: 340 },
      { name: 'Zone A3 - Storage', utilization: 68, items: 2100 },
      { name: 'Zone A4 - Returns', utilization: 45, items: 180 },
    ],
  },
  {
    id: 'WH-B', name: 'South Distribution Center', location: 'Austin, TX', capacity: 65000, used: 51000, racks: 320, racksUsed: 275,
    incoming: 2100, outgoing: 1450, temperature: 20, staff: 58, performance: 89,
    zones: [
      { name: 'Zone B1 - Energy', utilization: 78, items: 1430 },
      { name: 'Zone B2 - Displays', utilization: 62, items: 320 },
      { name: 'Zone B3 - Networking', utilization: 91, items: 2100 },
      { name: 'Zone B4 - Overflow', utilization: 55, items: 890 },
    ],
  },
  {
    id: 'WH-C', name: 'East Distribution Center', location: 'Newark, NJ', capacity: 40000, used: 22800, racks: 180, racksUsed: 112,
    incoming: 680, outgoing: 520, temperature: 16, staff: 31, performance: 78,
    zones: [
      { name: 'Zone C1 - Robotics', utilization: 72, items: 156 },
      { name: 'Zone C2 - Networking', utilization: 38, items: 42 },
      { name: 'Zone C3 - Assembly', utilization: 64, items: 480 },
      { name: 'Zone C4 - Shipping', utilization: 81, items: 320 },
    ],
  },
];

export const activities: Activity[] = [
  { id: 'a1', type: 'order', message: 'New order ORD-7842 from Helix Industries', time: '2 min ago' },
  { id: 'a2', type: 'alert', message: 'Low stock alert: Rugged Tablet POS (85 units)', time: '12 min ago' },
  { id: 'a3', type: 'shipment', message: 'ORD-7841 shipped from North Distribution Center', time: '28 min ago' },
  { id: 'a4', type: 'stock', message: 'Restocked Fiber Optic Cable Spool (+600 units)', time: '45 min ago' },
  { id: 'a5', type: 'system', message: 'AI model retrained on Q3 demand patterns', time: '1 hr ago' },
  { id: 'a6', type: 'order', message: 'Payment confirmed for ORD-7846', time: '2 hr ago' },
  { id: 'a7', type: 'shipment', message: 'ORD-7843 delivered to Vertex Global', time: '3 hr ago' },
  { id: 'a8', type: 'alert', message: 'Warehouse South Distribution Center at 78% capacity', time: '4 hr ago' },
];

export const aiInsights: AIInsight[] = [
  { id: 'i1', type: 'restock', title: 'Restock Rugged Tablet POS', description: 'Current stock at 85 units, below reorder level of 200. Demand projected to increase 34% next week.', severity: 'critical', product: 'Rugged Tablet POS', confidence: 94 },
  { id: 'i2', type: 'overstock', title: 'Overstock: Fiber Optic Cable Spool', description: 'Stock at 2100 units exceeds 4x reorder level. Consider promotional pricing to clear inventory.', severity: 'warning', product: 'Fiber Optic Cable Spool', confidence: 87 },
  { id: 'i3', type: 'capacity', title: 'South Distribution Center nearing capacity', description: 'Warehouse at 78% utilization. Incoming goods will push to 85% within 5 days. Recommend rerouting to East Distribution Center.', severity: 'warning', confidence: 91 },
  { id: 'i4', type: 'demand', title: 'Demand surge predicted for Q3', description: 'AI model detects 42% demand increase for Forklift Battery Pack in August. Pre-position inventory at South Distribution Center.', severity: 'info', product: 'Forklift Battery Pack', confidence: 88 },
  { id: 'i5', type: 'anomaly', title: 'Anomaly: Unusual order pattern', description: 'ORD-7850 payment failure detected. Customer Lumina Tech has 3 failed payments in 30 days. Flag for review.', severity: 'critical', confidence: 96 },
];

export const inventoryTrend = [
  { month: 'Feb', value: 42000, capacity: 50000 },
  { month: 'Mar', value: 45000, capacity: 50000 },
  { month: 'Apr', value: 41000, capacity: 50000 },
  { month: 'May', value: 47000, capacity: 50000 },
  { month: 'Jun', value: 49000, capacity: 50000 },
  { month: 'Jul', value: 52300, capacity: 50000 },
];

export const ordersTrend = [
  { day: 'Mon', orders: 42, revenue: 89000 },
  { day: 'Tue', orders: 58, revenue: 124000 },
  { day: 'Wed', orders: 51, revenue: 102000 },
  { day: 'Thu', orders: 67, revenue: 145000 },
  { day: 'Fri', orders: 78, revenue: 178000 },
  { day: 'Sat', orders: 34, revenue: 67000 },
  { day: 'Sun', orders: 28, revenue: 54000 },
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 1240000, target: 1100000 },
  { month: 'Feb', revenue: 1380000, target: 1150000 },
  { month: 'Mar', revenue: 1520000, target: 1200000 },
  { month: 'Apr', revenue: 1410000, target: 1250000 },
  { month: 'May', revenue: 1680000, target: 1300000 },
  { month: 'Jun', revenue: 1850000, target: 1350000 },
  { month: 'Jul', revenue: 2104000, target: 1400000 },
];

export const warehouseUtilization = [
  { name: 'North Distribution Center', used: 38500, capacity: 50000, pct: 77 },
  { name: 'South Distribution Center', used: 51000, capacity: 65000, pct: 78 },
  { name: 'East Distribution Center', used: 22800, capacity: 40000, pct: 57 },
];

export const categoryDistribution = [
  { name: 'Electronics', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Energy', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Networking', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Displays', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Robotics', value: 8, color: 'hsl(var(--chart-5))' },
];

export const topSellingProducts = [
  { name: 'Handheld Barcode Scanner', sales: 1840, revenue: 459981 },
  { name: 'Backup Power Unit', sales: 1120, revenue: 838880 },
  { name: 'Fiber Optic Cable Spool', sales: 3200, revenue: 287968 },
  { name: 'Forklift Battery Pack', sales: 680, revenue: 312460 },
  { name: 'LED Warehouse Display', sales: 420, revenue: 377580 },
];

export const notifications = [
  { id: 'n1', title: 'Critical Stock Alert', message: 'Rugged Tablet POS below threshold', time: '2m', type: 'critical', read: false },
  { id: 'n2', title: 'New Order', message: 'ORD-7842 from Helix Industries', time: '5m', type: 'info', read: false },
  { id: 'n3', title: 'Shipment Update', message: 'ORD-7841 has been shipped', time: '28m', type: 'success', read: false },
  { id: 'n4', title: 'Warehouse Capacity', message: 'South Distribution Center at 78% capacity', time: '1h', type: 'warning', read: true },
  { id: 'n5', title: 'AI Insight', message: 'Demand surge predicted for Q3', time: '2h', type: 'info', read: true },
];
