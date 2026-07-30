import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, Bell, Moon, Sun, ChevronDown, Boxes, Clock, Settings, LogOut, User, CheckCircle2, LayoutDashboard, Package, Warehouse as WarehouseIcon, BarChart3, GraduationCap } from 'lucide-react';
import { useThemeStore, useDataStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/warehouse', label: 'Warehouse', icon: WarehouseIcon },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/workflow', label: 'How It Works', icon: GraduationCap },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const notifs = useDataStore((s) => s.notifications);
  const markAllNotificationsRead = useDataStore((s) => s.markAllNotificationsRead);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markAllRead = () => markAllNotificationsRead();

  const notifColor: Record<string, string> = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 px-4 pt-4"
    >
      <div className="flex h-16 items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/90 px-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-lg shadow-primary/30">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight">StockFlow</p>
              <p className="text-[10px] text-muted-foreground">Inventory Platform v1.0</p>
            </div>
          </div>

          <nav className="ml-2 hidden items-center gap-1 md:flex">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;
              return (
                <NavLink key={item.to} to={item.to}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                      active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </motion.div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="relative flex-1 max-w-md">
          <motion.div
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            className="relative"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search orders, products, warehouses..."
              className="h-10 w-full rounded-xl border border-border/50 bg-card/50 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              ⌘K
            </kbd>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-border/50 bg-secondary/50 px-3 py-1.5 md:flex">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-medium tabular-nums">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:text-primary"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Moon className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Sun className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:text-primary"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <CheckCircle2 className="h-3 w-3" /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    {notifs.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'flex gap-3 border-b border-border/30 px-4 py-3 transition-colors hover:bg-primary/5',
                          !n.read && 'bg-primary/5'
                        )}
                      >
                        <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', notifColor[n.type])} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.message}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">{n.time === 'just now' ? n.time : `${n.time} ago`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/50 p-1.5 pr-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 text-xs font-bold text-white">
                AK
              </div>
              <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', profileOpen && 'rotate-180')} />
            </motion.button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-border/50 px-4 py-3">
                    <p className="text-sm font-semibold">Alex Kim</p>
                    <p className="text-xs text-muted-foreground">alex.kim@stockflow.io</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: 'My Profile' },
                      { icon: Settings, label: 'Settings' },
                      { icon: LogOut, label: 'Sign Out' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
