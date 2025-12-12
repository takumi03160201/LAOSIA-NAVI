// 店舗データ型定義
export interface StoreData {
  id: string;
  name: string;
  businessType: 'cafe' | 'izakaya' | 'restaurant';
  seats: number;
  operatingDays: number;
  openTime: string;
  closeTime: string;
}

// メニュー型定義
export interface MenuItem {
  id: string;
  name: string;
  category: 'food' | 'drink' | 'dessert';
  price: number;
  cost: number;
  imageUrl?: string;
  monthlySales: number;
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

// シミュレーションデータ型定義
export interface SimulationData {
  businessType: string;
  storeName: string;
  seats: number;
  operatingDays: number;
  openTime: string;
  closeTime: string;
  rent: number;
  utilities: number;
  otherFixed: number;
  ownerSalary: number;
  staffCount: number;
  hourlyWage: number;
  monthlyHours: number;
  avgSpending: number;
  customersPerDay: number;
  costRate: number;
}

// 資金繰りイベント型定義
export interface CashFlowEvent {
  type: 'in' | 'out';
  name: string;
  amount: number;
  alert?: boolean;
}

// ダッシュボードデータ型定義
export interface DashboardData {
  monthlySales: number;
  breakEvenSales: number;
  cashBalance: number;
  projectedProfit: number;
  profitTrend: number;
  costOfGoodsRate: number;
  laborCostRate: number;
  salesHistory: SalesHistoryItem[];
}

export interface SalesHistoryItem {
  month: string;
  sales: number;
  breakEven: number;
}
