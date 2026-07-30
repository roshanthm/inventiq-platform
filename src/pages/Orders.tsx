import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Pencil, Trash2, X, Filter, Package, ShoppingCart } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageTransition } from '@/components/shared/PageTransition';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Column,
  type Row,
} from '@tanstack/react-table';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Orders() {
  const data = useDataStore((s) => s.orders);
  const products = useDataStore((s) => s.products);
  const warehouses = useDataStore((s) => s.warehouses);
  const createOrder = useDataStore((s) => s.createOrder);
  const updateOrder = useDataStore((s) => s.updateOrder);
  const deleteOrderAction = useDataStore((s) => s.deleteOrder);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [shippingFilter, setShippingFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (paymentFilter !== 'all' && row.paymentStatus !== paymentFilter) return false;
      if (shippingFilter !== 'all' && row.shippingStatus !== shippingFilter) return false;
      if (priorityFilter !== 'all' && row.priority !== priorityFilter) return false;
      return true;
    });
  }, [data, paymentFilter, shippingFilter, priorityFilter]);

  const columns = useMemo<ColumnDef<Order>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 font-semibold">
          Order ID <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }: { row: Row<Order> }) => <span className="font-mono text-xs font-medium text-primary">{row.original.id}</span>,
    },
    {
      accessorKey: 'customer',
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 font-semibold">
          Customer <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <div>
          <p className="text-sm font-medium">{row.original.customer}</p>
          <p className="text-xs text-muted-foreground">{row.original.customerEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: 'products',
      header: 'Products',
      cell: ({ row }: { row: Row<Order> }) => (
        <div className="max-w-[200px]">
          <p className="truncate text-sm">{row.original.products.map((p: { name: string; qty: number; price: number }) => p.name).join(', ')}</p>
          <p className="text-xs text-muted-foreground">{row.original.products.reduce((s: number, p: { name: string; qty: number; price: number }) => s + p.qty, 0)} items</p>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'warehouse',
      header: 'Warehouse',
      cell: ({ row }: { row: Row<Order> }) => <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{row.original.warehouse}</span>,
    },
    {
      accessorKey: 'date',
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 font-semibold">
          Date <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }: { row: Row<Order> }) => <span className="text-sm text-muted-foreground">{row.original.date}</span>,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }: { row: Row<Order> }) => <StatusBadge status={row.original.paymentStatus} type="payment" />,
      enableSorting: false,
    },
    {
      accessorKey: 'shippingStatus',
      header: 'Shipping',
      cell: ({ row }: { row: Row<Order> }) => <StatusBadge status={row.original.shippingStatus} type="shipping" />,
      enableSorting: false,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }: { row: Row<Order> }) => <StatusBadge status={row.original.priority} type="priority" />,
      enableSorting: false,
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 font-semibold">
          Total <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }: { row: Row<Order> }) => <span className="text-sm font-semibold">${row.original.totalAmount.toLocaleString()}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: Row<Order> }) => (
        <div className="flex items-center gap-1.5">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(`/orders/${row.original.id}`)} className="flex h-8 w-8 items-center justify-center rounded-lg glass text-muted-foreground hover:text-primary">
            <Eye className="h-4 w-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditOrder(row.original)} className="flex h-8 w-8 items-center justify-center rounded-lg glass text-muted-foreground hover:text-primary">
            <Pencil className="h-4 w-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setDeleteId(row.original.id)} className="flex h-8 w-8 items-center justify-center rounded-lg glass text-muted-foreground hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      ),
      enableSorting: false,
    },
  ], [navigate]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  const handleDelete = () => {
    if (!deleteId) return;
    deleteOrderAction(deleteId);
    toast.success(`Order ${deleteId} deleted and stock restored`);
    setDeleteId(null);
  };

  const handleEditSave = (order: Order) => {
    updateOrder(order.id, {
      customer: order.customer,
      customerEmail: order.customerEmail,
      warehouse: order.warehouse,
      priority: order.priority,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
    });
    toast.success(`Order ${order.id} updated`);
    setEditOrder(null);
  };

  const handleCreateSave = (input: {
    customer: string; customerEmail: string; warehouse: string; priority: Order['priority'];
    paymentStatus: Order['paymentStatus']; shippingStatus: Order['shippingStatus'];
    items: { productId: string; qty: number }[];
  }) => {
    const result = createOrder(input);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Order ${result.order.id} created — dashboard, reports and warehouse updated`);
    setCreateOpen(false);
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Order
        </Button>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mb-4 flex flex-col gap-3 rounded-2xl p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search orders..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="h-4 w-4" /> Filters:
        </div>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full lg:w-[140px]"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={shippingFilter} onValueChange={setShippingFilter}>
          <SelectTrigger className="w-full lg:w-[140px]"><SelectValue placeholder="Shipping" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shipping</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full lg:w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-border overflow-hidden rounded-2xl">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="border-b border-border/50 bg-card/50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <AnimatePresence>
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border/30 transition-colors hover:bg-primary/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {table.getRowModel().rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl glass">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No orders found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your filters or search</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <EditOrderDialog open={!!editOrder} order={editOrder} onClose={() => setEditOrder(null)} onSave={handleEditSave} warehouses={warehouses} />

      {/* Create Dialog */}
      <CreateOrderDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreateSave} products={products} warehouses={warehouses} />

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Trash2 className="h-5 w-5 text-red-400" /> Delete Order</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete order <span className="font-mono font-semibold text-foreground">{deleteId}</span>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}


function EditOrderDialog({ open, order, onClose, onSave, warehouses }: {
  open: boolean; order: Order | null; onClose: () => void; onSave: (o: Order) => void;
  warehouses: { id: string; name: string }[];
}) {
  const [form, setForm] = useState<Order | null>(order);

  if (form?.id !== order?.id) setForm(order);
  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-strong max-h-[85vh] max-w-lg overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Edit Order {form.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Customer Name</Label>
              <Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Customer Email</Label>
              <Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Warehouse</Label>
              <Select value={form.warehouse} onValueChange={(v) => setForm({ ...form, warehouse: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.id} · {w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Order['priority'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Payment Status</Label>
              <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v as Order['paymentStatus'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Shipping Status</Label>
              <Select value={form.shippingStatus} onValueChange={(v) => setForm({ ...form, shippingStatus: v as Order['shippingStatus'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Line items are locked after creation since stock has already been allocated for this order. Delete and recreate the order to change products.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface LineItem { productId: string; qty: number }

function CreateOrderDialog({ open, onClose, onSave, products, warehouses }: {
  open: boolean; onClose: () => void;
  onSave: (input: { customer: string; customerEmail: string; warehouse: string; priority: Order['priority']; paymentStatus: Order['paymentStatus']; shippingStatus: Order['shippingStatus']; items: LineItem[] }) => void;
  products: { id: string; name: string; price: number; stock: number; warehouse: string }[];
  warehouses: { id: string; name: string }[];
}) {
  const emptyForm = {
    customer: '', customerEmail: '',
    warehouse: warehouses[0]?.id || 'WH-A',
    priority: 'medium' as Order['priority'],
    paymentStatus: 'pending' as Order['paymentStatus'],
    shippingStatus: 'pending' as Order['shippingStatus'],
  };
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState<LineItem[]>([{ productId: products[0]?.id || '', qty: 1 }]);

  const reset = () => { setForm(emptyForm); setItems([{ productId: products[0]?.id || '', qty: 1 }]); };

  const total = items.reduce((s, it) => {
    const p = products.find((pr) => pr.id === it.productId);
    return s + (p ? p.price * it.qty : 0);
  }, 0);

  const handleSubmit = () => {
    if (!form.customer.trim() || !form.customerEmail.trim()) {
      toast.error('Customer name and email are required.');
      return;
    }
    onSave({ ...form, items });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="glass-strong max-h-[85vh] max-w-lg overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Create New Order
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Customer Name</Label>
              <Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Company name" />
            </div>
            <div>
              <Label className="text-xs">Customer Email</Label>
              <Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="email@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Warehouse</Label>
              <Select value={form.warehouse} onValueChange={(v) => setForm({ ...form, warehouse: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.id} · {w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Order['priority'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Payment Status</Label>
              <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v as Order['paymentStatus'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Shipping Status</Label>
              <Select value={form.shippingStatus} onValueChange={(v) => setForm({ ...form, shippingStatus: v as Order['shippingStatus'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Products</Label>
              <Button
                type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                onClick={() => setItems([...items, { productId: products[0]?.id || '', qty: 1 }])}
              >
                <Plus className="h-3 w-3" /> Add Product
              </Button>
            </div>
            {items.map((item, i) => {
              const p = products.find((pr) => pr.id === item.productId);
              return (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/40 p-2">
                  <Select value={item.productId} onValueChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, productId: v } : it))}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {products.map((pr) => (
                        <SelectItem key={pr.id} value={pr.id}>{pr.name} · ${pr.price.toFixed(2)} ({pr.stock} in stock)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number" min={1} max={p?.stock ?? undefined}
                    value={item.qty}
                    onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, qty: Math.max(1, +e.target.value) } : it))}
                    className="w-20"
                  />
                  {items.length > 1 && (
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
            <span className="text-sm text-muted-foreground">Order Total</span>
            <span className="text-lg font-bold">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); reset(); }}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
