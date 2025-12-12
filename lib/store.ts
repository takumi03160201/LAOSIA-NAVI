import { create } from 'zustand';
import { StoreData, MenuItem, SimulationData, DashboardData } from './types';

interface AppState {
  // 店舗データ
  storeData: StoreData | null;
  setStoreData: (data: StoreData) => void;

  // メニューデータ
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
  addMenu: (menu: MenuItem) => void;
  updateMenu: (id: string, menu: Partial<MenuItem>) => void;
  deleteMenu: (id: string) => void;

  // シミュレーションデータ
  simulationData: SimulationData | null;
  setSimulationData: (data: SimulationData) => void;

  // ダッシュボードデータ
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData) => void;
}

export const useStore = create<AppState>((set) => ({
  // 初期値
  storeData: {
    id: '1',
    name: 'カフェ ラオシア',
    businessType: 'cafe',
    seats: 20,
    operatingDays: 26,
    openTime: '10:00',
    closeTime: '18:00',
  },
  setStoreData: (data) => set({ storeData: data }),

  menus: [
    {
      id: '1',
      name: 'ブレンドコーヒー',
      category: 'drink',
      price: 450,
      cost: 90,
      imageUrl: '☕',
      monthlySales: 450,
      ingredients: [
        { id: '1', name: 'コーヒー豆', quantity: 15, unit: 'g', unitPrice: 4 },
        { id: '2', name: '水', quantity: 200, unit: 'ml', unitPrice: 0.15 },
      ],
    },
    {
      id: '2',
      name: 'カルボナーラ',
      category: 'food',
      price: 980,
      cost: 420,
      imageUrl: '🍝',
      monthlySales: 380,
      ingredients: [
        { id: '1', name: 'パスタ', quantity: 100, unit: 'g', unitPrice: 2 },
        { id: '2', name: '卵', quantity: 2, unit: '個', unitPrice: 30 },
        { id: '3', name: 'ベーコン', quantity: 50, unit: 'g', unitPrice: 3 },
        { id: '4', name: 'その他', quantity: 1, unit: '式', unitPrice: 10 },
      ],
    },
  ],
  setMenus: (menus) => set({ menus }),
  addMenu: (menu) => set((state) => ({ menus: [...state.menus, menu] })),
  updateMenu: (id, updatedMenu) =>
    set((state) => ({
      menus: state.menus.map((menu) =>
        menu.id === id ? { ...menu, ...updatedMenu } : menu
      ),
    })),
  deleteMenu: (id) =>
    set((state) => ({
      menus: state.menus.filter((menu) => menu.id !== id),
    })),

  simulationData: null,
  setSimulationData: (data) => set({ simulationData: data }),

  dashboardData: {
    monthlySales: 850000,
    breakEvenSales: 1200000,
    cashBalance: 2300000,
    projectedProfit: 120000,
    profitTrend: 15,
    costOfGoodsRate: 32,
    laborCostRate: 28,
    salesHistory: [
      { month: '10月', sales: 780000, breakEven: 1200000 },
      { month: '11月', sales: 820000, breakEven: 1200000 },
      { month: '12月', sales: 850000, breakEven: 1200000 },
    ],
  },
  setDashboardData: (data) => set({ dashboardData: data }),
}));
