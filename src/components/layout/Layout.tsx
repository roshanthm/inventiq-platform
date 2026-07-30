import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0 grid-bg opacity-20" />
      <div className="pointer-events-none fixed left-1/4 top-0 z-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed right-0 top-1/3 z-0 h-[400px] w-[400px] rounded-full bg-chart-4/10 blur-[120px]" />

      <Navbar />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Outlet />
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
