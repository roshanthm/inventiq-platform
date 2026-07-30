import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  orders as seedOrders,
  products as seedProducts,
  warehouses as seedWarehouses,
  activities as seedActivities,
  notifications as seedNotifications,
} from './data';
import type { Order, Product, Warehouse, Activity } from './types';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (t: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('light', next === 'light');
        set({ theme: next });
      },
      setTheme: (t) => {
        document.documentElement.classList.toggle('light', t === 'light');
        set({ theme: t });
      },
    }),
    { name: 'inv-theme' }
  )
);

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
}

interface DataState {
  orders: Order[];
  products: Product[];
  warehouses: Warehouse[];
  activities: Activity[];
  notifications: AppNotification[];
  nextOrderSeq: number;

  createOrder: (input: {
    customer: string;
    customerEmail: string;
    warehouse: string;
    priority: Order['priority'];
    paymentStatus: Order['paymentStatus'];
    shippingStatus: Order['shippingStatus'];
    items: { productId: string; qty: number }[];
  }) => { ok: true; order: Order } | { ok: false; error: string };
  updateOrder: (id: string, patch: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  addStock: (productId: string, qty: number) => void;

  simulateLiveTick: () => void;
  fulfillOrder: (id: string) => void;

  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  pushActivity: (type: Activity['type'], message: string) => void;
  pushNotification: (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
}

function timeNow() {
  return 'just now';
}

function buildTimeline(paymentStatus: Order['paymentStatus'], shippingStatus: Order['shippingStatus']): Order['timeline'] {
  const today = new Date().toISOString().slice(0, 10);
  const steps: Order['timeline'] = [{ status: 'Order Placed', date: today, done: true }];
  if (paymentStatus === 'failed') {
    steps.push({ status: 'Payment Failed', date: today, done: true });
    steps.push({ status: 'Awaiting Payment', date: today, done: false });
    return steps;
  }
  steps.push({ status: 'Payment Confirmed', date: today, done: paymentStatus === 'paid' });
  if (shippingStatus === 'cancelled') {
    steps.push({ status: 'Cancelled', date: today, done: true });
    return steps;
  }
  steps.push({ status: 'Processing', date: today, done: ['processing', 'shipped', 'delivered'].includes(shippingStatus) });
  steps.push({ status: 'Shipped', date: today, done: ['shipped', 'delivered'].includes(shippingStatus) });
  steps.push({ status: 'Delivered', date: today, done: shippingStatus === 'delivered' });
  return steps;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      products: seedProducts,
      warehouses: seedWarehouses,
      activities: seedActivities,
      notifications: seedNotifications.map((n) => ({ ...n, type: n.type as AppNotification['type'] })),
      nextOrderSeq: 7853,

      pushActivity: (type, message) => {
        set((s) => ({
          activities: [{ id: `a-${Date.now()}`, type, message, time: timeNow() }, ...s.activities].slice(0, 30),
        }));
      },

      pushNotification: (n) => {
        set((s) => ({
          notifications: [{ id: `n-${Date.now()}`, time: timeNow(), read: false, ...n }, ...s.notifications].slice(0, 30),
        }));
      },

      createOrder: (input) => {
        const state = get();
        const items = input.items.filter((i) => i.productId && i.qty > 0);
        if (items.length === 0) {
          return { ok: false, error: 'Add at least one product to the order.' };
        }

        for (const item of items) {
          const product = state.products.find((p) => p.id === item.productId);
          if (!product) return { ok: false, error: 'Selected product not found.' };
          if (item.qty > product.stock) {
            return { ok: false, error: `Only ${product.stock} units of ${product.name} available.` };
          }
        }

        const lineItems = items.map((item) => {
          const product = state.products.find((p) => p.id === item.productId)!;
          return { name: product.name, qty: item.qty, price: product.price, productId: product.id };
        });
        const totalAmount = lineItems.reduce((s, p) => s + p.qty * p.price, 0);
        const id = `ORD-${state.nextOrderSeq}`;
        const order: Order = {
          id,
          customer: input.customer,
          customerEmail: input.customerEmail,
          products: lineItems.map(({ name, qty, price }) => ({ name, qty, price })),
          warehouse: input.warehouse,
          date: new Date().toISOString().slice(0, 10),
          paymentStatus: input.paymentStatus,
          shippingStatus: input.shippingStatus,
          priority: input.priority,
          totalAmount,
          timeline: buildTimeline(input.paymentStatus, input.shippingStatus),
        };

        set((s) => {
          const products = s.products.map((p) => {
            const line = lineItems.find((l) => l.productId === p.id);
            return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
          });
          const totalQty = lineItems.reduce((sum, l) => sum + l.qty, 0);
          const warehouses = s.warehouses.map((w) =>
            w.id === input.warehouse
              ? { ...w, used: Math.max(0, w.used - totalQty * 2), outgoing: w.outgoing + totalQty }
              : w
          );
          return {
            orders: [order, ...s.orders],
            products,
            warehouses,
            nextOrderSeq: s.nextOrderSeq + 1,
          };
        });

        get().pushActivity('order', `New order ${id} from ${input.customer} — $${totalAmount.toLocaleString()}`);
        get().pushNotification({ title: 'New Order', message: `${id} from ${input.customer}`, type: 'info' });

        const refreshed = get().products;
        for (const item of items) {
          const product = refreshed.find((p) => p.id === item.productId);
          if (product && product.stock <= product.reorderLevel) {
            get().pushActivity('alert', `Low stock alert: ${product.name} (${product.stock} units)`);
            get().pushNotification({ title: 'Low Stock Alert', message: `${product.name} at ${product.stock} units`, type: 'warning' });
          }
        }

        return { ok: true, order };
      },

      updateOrder: (id, patch) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
        }));
        if (patch.shippingStatus) {
          get().pushActivity('shipment', `Order ${id} marked as ${patch.shippingStatus}`);
        }
        if (patch.paymentStatus) {
          get().pushActivity('order', `Payment for ${id} marked as ${patch.paymentStatus}`);
        }
      },

      deleteOrder: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return;
        set((s) => {
          const products = s.products.map((p) => {
            const line = order.products.find((op) => op.name === p.name);
            return line ? { ...p, stock: p.stock + line.qty } : p;
          });
          const totalQty = order.products.reduce((sum, p) => sum + p.qty, 0);
          const warehouses = s.warehouses.map((w) =>
            w.id === order.warehouse ? { ...w, used: w.used + totalQty * 2, outgoing: Math.max(0, w.outgoing - totalQty) } : w
          );
          return {
            orders: s.orders.filter((o) => o.id !== id),
            products,
            warehouses,
          };
        });
        get().pushActivity('system', `Order ${id} deleted and stock restored`);
      },

      addStock: (productId, qty) => {
        if (qty <= 0) return;
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;
        set((s) => ({
          products: s.products.map((p) => (p.id === productId ? { ...p, stock: p.stock + qty } : p)),
          warehouses: s.warehouses.map((w) =>
            w.id === product.warehouse ? { ...w, used: w.used + qty * 2, incoming: w.incoming + qty } : w
          ),
        }));
        get().pushActivity('stock', `Restocked ${product.name} (+${qty} units)`);
        get().pushNotification({ title: 'Stock Updated', message: `${product.name} +${qty} units`, type: 'success' });
      },

      simulateLiveTick: () => {
        set((s) => ({
          warehouses: s.warehouses.map((w) => {
            const usedDrift = Math.round((Math.random() - 0.5) * 40);
            const used = Math.min(w.capacity, Math.max(Math.round(w.capacity * 0.3), w.used + usedDrift));
            const incoming = Math.max(0, w.incoming + Math.round((Math.random() - 0.45) * 6));
            const outgoing = Math.max(0, w.outgoing + Math.round((Math.random() - 0.45) * 6));
            const performance = Math.min(99, Math.max(70, Math.round(w.performance + (Math.random() - 0.5) * 2)));
            const zones = w.zones.map((z) => ({
              ...z,
              utilization: Math.min(99, Math.max(15, Math.round(z.utilization + (Math.random() - 0.5) * 4))),
            }));
            return { ...w, used, incoming, outgoing, performance, zones };
          }),
        }));
      },

      fulfillOrder: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return;
        const next: Record<Order['shippingStatus'], Order['shippingStatus']> = {
          pending: 'processing',
          processing: 'shipped',
          shipped: 'delivered',
          delivered: 'delivered',
          cancelled: 'cancelled',
        };
        const nextStatus = next[order.shippingStatus];
        if (nextStatus === order.shippingStatus) return;
        get().updateOrder(id, { shippingStatus: nextStatus });
      },

      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    }),
    { name: 'inv-data' }
  )
);
