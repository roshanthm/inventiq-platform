export interface Activity {
  id: string;
  title: string;
  type: 'approval' | 'warning' | 'transfer' | 'departure' | 'custom';
  location: string;
  details: string;
  timeStr: string;
  timestamp: number; // ms ago
}

export interface Optimization {
  id: string;
  title: string;
  lift: string;
  details: string;
  type: 'bundle' | 'discount' | 'other';
}

export interface Shipment {
  id: string;
  code: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'Incoming' | 'Outgoing' | 'Returns' | 'Delayed' | 'Transfers';
  details: string;
  value?: string;
  items?: string;
  eta?: string;
  timestamp: number;
}

export interface RiskItem {
  id: string;
  label: string;
  value: string;
  type: 'delay' | 'weather' | 'congestion';
  status: string;
}

export interface OperationsCenter {
  incoming: { count: number; trend: string; nextDue: string };
  outgoing: { count: number; trend: string; peakHour: string };
  returns: { count: number; trend: string; avgProc: string };
  delayed: { count: number; details: string };
  transfers: { count: number; trend: string; route: string };
}

export interface MapNode {
  id: string;
  label: string;
  lat: number;
  lng: number;
  type: 'hq' | 'hub' | 'node';
  coords: { top: string; left: string }; // CSS percentages
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  warehouse: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unitPrice: number;
  totalValue: string;
}

export interface DashboardData {
  inventoryHealth: number;
  stockMove: string;
  overallHealth: number;
  metrics: {
    inventoryRisk: string;
    inventoryRiskVal: number;
    demandStability: number;
    supplierReliability: number;
    warehouseEfficiency: number;
  };
  riskRadar: RiskItem[];
  optimizations: Optimization[];
  activities: Activity[];
  operations: OperationsCenter;
  mapNodes: MapNode[];
  shipments: Shipment[];
}
