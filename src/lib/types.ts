export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type ShippingStatus = 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  products: { name: string; qty: number; price: number }[];
  warehouse: string;
  date: string;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  priority: Priority;
  totalAmount: number;
  timeline: { status: string; date: string; done: boolean }[];
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  used: number;
  racks: number;
  racksUsed: number;
  incoming: number;
  outgoing: number;
  temperature: number;
  staff: number;
  performance: number;
  zones: { name: string; utilization: number; items: number }[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  price: number;
  warehouse: string;
  trend: number[];
}

export interface Activity {
  id: string;
  type: 'order' | 'stock' | 'shipment' | 'alert' | 'system';
  message: string;
  time: string;
}

export interface AIInsight {
  id: string;
  type: 'restock' | 'overstock' | 'capacity' | 'demand' | 'anomaly';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  product?: string;
  confidence: number;
}
