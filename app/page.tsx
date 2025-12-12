'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, Menu, Bell, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function Dashboard() {
  const { dashboardData, storeData } = useStore();

  if (!dashboardData) return <div>Loading...</div>;

  const achievementRate = (dashboardData.monthlySales / dashboardData.breakEvenSales) * 100;
  const shortfall = dashboardData.breakEvenSales - dashboardData.monthlySales;
  const cashStatus = dashboardData.cashBalance > 2000000 ? 'safe' : 
                     dashboardData.cashBalance > 1000000 ? 'warning' : 'danger';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">LAOSIA NAVI</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-24">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 売上予測カード */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">今月売上予測</span>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">
                ¥{dashboardData.monthlySales.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">損益分岐まであと</span>
                <span className="font-semibold text-amber-600">¥{shortfall.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min(achievementRate, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">達成率 {achievementRate.toFixed(0)}%</p>
            </div>
          </div>

          {/* 現金残高カード */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">現金残高</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">
                ¥{dashboardData.cashBalance.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                cashStatus === 'safe' ? 'bg-green-100 text-green-700' :
                cashStatus === 'warning' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {cashStatus === 'safe' ? '🟢 安全' : cashStatus === 'warning' ? '🟡 注意' : '🔴 危険'}
              </span>
              <span className="text-xs text-gray-500">運転資金3ヶ月分以上</span>
            </div>
          </div>
        </div>

        {/* 利益予測カード */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-800 mb-1">今月利益予測</p>
              <p className="text-3xl font-bold text-orange-900">
                +¥{dashboardData.projectedProfit.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{dashboardData.profitTrend}%
              </span>
              <p className="text-xs text-orange-700 mt-1">前月比</p>
            </div>
          </div>
        </div>

        {/* 売上推移グラフ */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">売上推移</h3>
          <div className="space-y-3">
            {dashboardData.salesHistory.map((data, index) => {
              const rate = (data.sales / data.breakEven) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{data.month}</span>
                    <span className="text-gray-600">¥{data.sales.toLocaleString()}</span>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${Math.min(rate, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* コスト構造 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DonutChartCard
            title="原価率"
            percentage={dashboardData.costOfGoodsRate}
            color="orange"
          />
          <DonutChartCard
            title="人件費率"
            percentage={dashboardData.laborCostRate}
            color="blue"
          />
        </div>

        {/* AIアドバイスカード */}
        <Link href="/ai">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-2">AIからのアドバイス</h4>
                <p className="text-sm text-blue-800 mb-3">
                  原価率が業界平均より高めです。メニュー見直しで月5万円改善できる可能性があります。
                </p>
                <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  詳しく見る
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="grid grid-cols-4 gap-2 max-w-4xl mx-auto">
          <NavButton label="ホーム" href="/" active />
          <NavButton label="メニュー" href="/menu" />
          <NavButton label="分析" href="/analysis" />
          <NavButton label="資金繰り" href="/cashflow" />
        </div>
      </nav>
    </div>
  );
}

function DonutChartCard({ title, percentage, color }: { title: string; percentage: number; color: string }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const colorClasses = {
    orange: 'text-orange-500',
    blue: 'text-blue-500'
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={colorClasses[color]}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${colorClasses[color]}`}>
              {percentage}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">業界平均</p>
          <p className="text-lg font-semibold text-gray-700">30%</p>
          <Link href="/analysis">
            <button className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-medium">
              詳細を見る →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function NavButton({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  return (
    <Link href={href}>
      <button className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
        active 
          ? 'bg-orange-100 text-orange-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}>
        {label}
      </button>
    </Link>
  );
}
