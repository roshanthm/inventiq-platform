import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Plus, 
  MapPin, 
  Check, 
  Package, 
  Warehouse as WarehouseIcon, 
  ShoppingCart, 
  Users, 
  BarChart, 
  HelpCircle, 
  Settings as SettingsIcon, 
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

import SideNavBar from './components/SideNavBar';
import TopAppBar from './components/TopAppBar';
import BentoGrid from './components/BentoGrid';
import OperationsControlCenter from './components/OperationsControlCenter';
import NewShipmentModal from './components/NewShipmentModal';
import AiAssistant from './components/AiAssistant';
import InventoryView from './components/InventoryView';
import WarehouseView from './components/WarehouseView';
import OrdersView from './components/OrdersView';
import ReportsView from './components/ReportsView';
import SuppliersView from './components/SuppliersView';
import { DashboardData, Optimization, Shipment } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerNewEntry, setTriggerNewEntry] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  // Dynamic Date & Time Ticker
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      };
      setTimeStr(now.toLocaleDateString('en-US', options).replace(/,/g, ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Logistics Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching logistics data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Registering a Shipment
  const handleRegisterShipment = async (shipmentData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          showToast(`Successfully registered shipment ${shipmentData.code}! System operational metrics adjusted.`, 'success');
          // Re-fetch state
          await fetchData();
          return true;
        }
      }
    } catch (err) {
      console.error("Error registering shipment:", err);
    }
    return false;
  };

  // Toast trigger
  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Apply Optimization suggestion
  const handleApplyOptimization = (opt: Optimization) => {
    if (!data) return;
    
    // Simulate updating backend or local state with the Applied optimization
    showToast(`AI Optimization Applied: "${opt.title}" has been scheduled.`, 'success');
    
    // Smoothly adjust overall health metrics to demonstrate operational impact
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        overallHealth: Math.min(100, Number((prev.overallHealth + 0.5).toFixed(1))),
        inventoryHealth: Math.min(100, prev.inventoryHealth + 2),
        optimizations: prev.optimizations.filter(o => o.id !== opt.id)
      };
    });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#0b1020] flex flex-col items-center justify-center text-slate-300 font-mono gap-4" id="fullscreen-loader">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#5b8cff]/20 border-t-[#5b8cff] rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-[#5b8cff] absolute animate-pulse" />
        </div>
        <p className="text-xs text-slate-400 tracking-widest uppercase animate-pulse">Initializing Inventra OS Cluster...</p>
      </div>
    );
  }

  // Filter shipments if search active
  const filteredShipments = data?.shipments.filter(s => 
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.carrier.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-200 selection:bg-[#5b8cff]/30" id="inventra-app-root">
      
      {/* Sidebar Navigation */}
      <SideNavBar 
        onNewShipmentClick={() => {
          if (activeTab === 'inventory') {
            setTriggerNewEntry(true);
          } else {
            setIsModalOpen(true);
          }
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="ml-[240px] min-h-screen flex flex-col" id="inventra-main-content">
        
        {/* Top App Bar */}
        <TopAppBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNotificationsClick={() => showToast("Notifications up-to-date: All supply routes operational.", "info")}
          onHistoryClick={() => showToast("Accessing encrypted log databases...", "info")}
          unreadNotifications={true}
        />

        {/* Dynamic Context Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              id="live-alert-toast"
              className="fixed top-18 right-6 z-50 p-4 rounded-xl border glass-card shadow-2xl max-w-sm"
            >
              <div className="flex gap-2.5 items-start">
                <div className={`p-1 rounded-lg ${toastType === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#5b8cff]/15 text-[#5b8cff]'}`}>
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">System Synchronized</p>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toastMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Routing & Dynamic Content Rendering */}
        <div className="p-6 max-w-[1440px] w-full mx-auto flex-1">
          
          {activeTab === 'dashboard' && data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="view-dashboard"
            >
              {/* Hero Header Area */}
              <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6" id="dashboard-hero-header">
                <div>
                  <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                    Good Morning, Alex Chen
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 status-pulse"></span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wide">
                        System: All Nodes Operational
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      {timeStr}
                    </span>
                  </div>
                </div>

                {/* Top Statistics widgets */}
                <div className="flex gap-4" id="top-stats-row">
                  <div className="glass-card px-4 py-3.5 rounded-xl min-w-[160px] flex flex-col justify-between">
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">Inventory Health</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-[#5b8cff] tracking-tight">{data.inventoryHealth}%</span>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  
                  <div className="glass-card px-4 py-3.5 rounded-xl min-w-[160px] flex flex-col justify-between">
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">Stock Move</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-white tracking-tight">{data.stockMove}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid layout */}
              <BentoGrid 
                data={data} 
                onAuditTrailClick={() => setActiveTab('orders')}
                onApplyOptimization={handleApplyOptimization}
              />

              {/* Operations Control Center lists */}
              <OperationsControlCenter 
                data={data} 
                selectedWarehouse={selectedWarehouse} 
                setSelectedWarehouse={setSelectedWarehouse}
              />
            </motion.div>
          )}

          {/* Sub-Views for complete non-dashboard navigation */}
          
          {/* 1. Inventory View */}
          {activeTab === 'inventory' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              id="view-inventory"
            >
              <InventoryView 
                showToast={showToast}
                triggerNewEntryExternally={triggerNewEntry}
                onCloseExternalTrigger={() => setTriggerNewEntry(false)}
              />
            </motion.div>
          )}

          {/* 2. Warehouse View */}
          {activeTab === 'warehouse' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              id="view-warehouse"
            >
              <WarehouseView showToast={showToast} />
            </motion.div>
          )}

          {/* 3. Orders / Shipments Registers */}
          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              id="view-orders"
            >
              <OrdersView showToast={showToast} />
            </motion.div>
          )}

          {/* 4. Suppliers View */}
          {activeTab === 'suppliers' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              id="view-suppliers"
            >
              <SuppliersView showToast={showToast} />
            </motion.div>
          )}

          {/* 5. Reports View */}
          {activeTab === 'reports' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              id="view-reports"
            >
              <ReportsView showToast={showToast} />
            </motion.div>
          )}

          {/* 6. Settings View */}
          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
              id="view-settings"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#5b8cff]" />
                System Configuration & Parameters
              </h3>
              <p className="text-xs text-slate-400 mb-6">Manage API hooks, credentials, neural weights, and local system presets.</p>

              <div className="space-y-4 max-w-md font-mono text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase">Google GenAI Client SDK</p>
                  <p className="text-white font-bold">@google/genai Version ^2.4.0</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase">Active AI model</p>
                  <p className="text-[#5b8cff] font-bold">gemini-3.5-flash (Operational)</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase">System Ingress Port</p>
                  <p className="text-emerald-400 font-bold">3000 (Proxy Routing Active)</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. Support View */}
          {activeTab === 'support' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
              id="view-support"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#5b8cff]" />
                Inventra Support Portal
              </h3>
              <p className="text-xs text-slate-400 mb-6">Connect with deep logistical analytics team or AI systems administration.</p>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl max-w-sm">
                <h4 className="text-sm font-bold text-white mb-1">Direct Terminal Link</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">For emergency re-routing approval or neural assistance override, please connect with system admins.</p>
                <div className="text-xs font-mono text-slate-400 space-y-1">
                  <p>Email: <span className="text-[#5b8cff]">support@inventra.ai</span></p>
                  <p>Priority support: <span className="text-[#5b8cff]">1-800-AI-LOGS</span></p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* Floating AI assistant panel */}
      <AiAssistant onShipmentNeedsForm={() => setIsModalOpen(true)} />

      {/* New Shipment Manifest creation Modal */}
      <NewShipmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterShipment}
      />

    </div>
  );
}
