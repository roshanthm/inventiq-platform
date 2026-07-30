import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import OrderDetail from '@/pages/OrderDetail';
import WarehousePage from '@/pages/Warehouse';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Workflow from '@/pages/Workflow';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workflow" element={<Workflow />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
