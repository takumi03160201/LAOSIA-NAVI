'use client';

import { useState } from 'react';
import { Search, Plus, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function MenuList() {
  const { menus } = useStore();
  const [sortBy, setSortBy] = useState('profit-desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 統計計算
  const stats = {
    avgCostRate: (menus.reduce((sum, m) => sum + (m.cost / m.price), 0) / menus.length * 100).toFixed(1),
    totalProfit: menus.reduce((sum, m) => sum + (m.price - m.cost) * m.monthlySales, 0),
    count: menus.length
  };

  // フィルタリングとソート
  let filteredMenus = menus.filter(m => 
    (categoryFilter === 'all' || m.category === categoryFilter) &&
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredMenus.sort((a, b) => {
    const profitA = a.price - a.cost;
    const profitB = b.price - b.cost;
    const costRateA = (a.cost / a.price) * 100;
    const costRateB = (b.cost / b.price) * 100;

    switch (sortBy) {
      case 'profit-desc': return profitB - profitA;
      case 'cost-rate-desc': return costRateB - costRateA;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'sales-desc': return b.monthlySales - a.monthlySales;
      default: return 0;
    }
  });

  const getStatusBadge = (costRate: number, profit: number) => {
    if (costRate >= 40) return { label: '要改善', color: 'amber', icon: AlertTriangle };
    if (profit >= 400) return { label: '優秀', color: 'green', icon: CheckCircle };
    return { label: '標準', color: 'gray', icon: CheckCircle };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">メニュー管理</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="メニューを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4 max-w-4xl">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-orange-800 mb-1">平均原価率</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgCostRate}%</p>
            </div>
            <div>
              <p className="text-xs text-orange-800 mb-1">総粗利(月間)</p>
              <p className="text-2xl font-bold text-orange-600">¥{(stats.totalProfit / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-xs text-orange-800 mb-1">登録数</p>
              <p className="text-2xl font-bold text-orange-600">{stats.count}品</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="profit-desc">利益が高い順</option>
            <option value="cost-rate-desc">原価率が高い順</option>
            <option value="sales-desc">売れ筋順</option>
            <option value="name-asc">名前順</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">全カテゴリ</option>
            <option value="food">フード</option>
            <option value="drink">ドリンク</option>
            <option value="dessert">デザート</option>
          </select>
        </div>

        {/* Menu List */}
        <div className="space-y-3">
          {filteredMenus.map(menu => {
            const costRate = (menu.cost / menu.price) * 100;
            const profit = menu.price - menu.cost;
            const status = getStatusBadge(costRate, profit);
            const StatusIcon = status.icon;

            return (
              <Link key={menu.id} href={`/menu/${menu.id}`}>
                <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {menu.imageUrl}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{menu.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 flex items-center gap-1 ${
                          status.color === 'green' ? 'bg-green-100 text-green-700' :
                          status.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        ¥{menu.price.toLocaleString()} · 原価¥{menu.cost.toLocaleString()} ({costRate.toFixed(0)}%)
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${profit >= 300 ? 'text-green-600' : 'text-gray-600'}`}>
                          粗利 ¥{profit.toLocaleString()}
                        </p>
                        <span className="text-xs text-gray-500">月{menu.monthlySales}個販売</span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredMenus.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">該当するメニューが見つかりません</p>
          </div>
        )}
      </main>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-20">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
