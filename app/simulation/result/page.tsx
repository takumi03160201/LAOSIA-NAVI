'use client';

import React from 'react';
import { ArrowLeft, Download, TrendingUp, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SimulationResult() {
  // サンプル計算結果
  const formData = {
    businessType: 'cafe',
    storeName: 'カフェ ラオシア',
    seats: 20,
    operatingDays: 26,
    rent: 150000,
    utilities: 30000,
    otherFixed: 50000,
    ownerSalary: 250000,
    staffCount: 2,
    hourlyWage: 1100,
    monthlyHours: 160,
    avgSpending: 800,
    customersPerDay: 40,
    costRate: 30
  };

  // 計算
  const fixedCost = formData.rent + formData.utilities + formData.otherFixed;
  const laborCost = formData.ownerSalary + (formData.staffCount * formData.hourlyWage * formData.monthlyHours);
  const totalFixedCost = fixedCost + laborCost;
  
  const projectedSales = formData.avgSpending * formData.customersPerDay * formData.operatingDays;
  const cogs = projectedSales * (formData.costRate / 100);
  
  const breakEvenSales = totalFixedCost / (1 - formData.costRate / 100);
  const breakEvenCustomers = Math.ceil(breakEvenSales / formData.avgSpending / formData.operatingDays);
  
  const achievementRate = (projectedSales / breakEvenSales) * 100;
  const shortfall = breakEvenSales - projectedSales;
  const isAchieved = achievementRate >= 100;

  // コスト内訳
  const costBreakdown = [
    { name: '家賃', amount: formData.rent, color: 'bg-blue-500', percentage: (formData.rent / totalFixedCost * 100).toFixed(0) },
    { name: '人件費', amount: laborCost, color: 'bg-orange-500', percentage: (laborCost / totalFixedCost * 100).toFixed(0) },
    { name: '光熱費', amount: formData.utilities, color: 'bg-green-500', percentage: (formData.utilities / totalFixedCost * 100).toFixed(0) },
    { name: 'その他', amount: formData.otherFixed, color: 'bg-gray-400', percentage: (formData.otherFixed / totalFixedCost * 100).toFixed(0) }
  ];

  // リスクレベル判定
  const laborRate = (laborCost / projectedSales) * 100;
  const getRiskLevel = () => {
    if (!isAchieved && laborRate > 35) return { level: 'high', label: '高', color: 'red' };
    if (!isAchieved || laborRate > 30) return { level: 'medium', label: '中', color: 'amber' };
    return { level: 'low', label: '低', color: 'green' };
  };
  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/simulation/input">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">シミュレーション結果</h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-20">
        {/* Hero Result Card */}
        <div className={`rounded-2xl p-8 text-center border-2 ${
          isAchieved 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500' 
            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-500'
        }`}>
          <p className="text-sm text-gray-700 mb-2">損益分岐売上</p>
          <p className="text-5xl font-bold text-gray-900 mb-4">
            ¥{breakEvenSales.toLocaleString()}
          </p>
          
          <div className="h-px bg-gray-300 my-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              {isAchieved ? (
                <span className="text-green-700 flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  クリア見込み
                </span>
              ) : (
                <span className="text-amber-700 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  あと ¥{shortfall.toLocaleString()}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600">
              達成率: {achievementRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="損益分岐客数"
            value={breakEvenCustomers}
            unit="人/日"
            icon="👥"
          />
          <MetricCard
            label="必要回転率"
            value={(breakEvenCustomers / formData.seats).toFixed(1)}
            unit="回"
            icon="🔄"
          />
          <MetricCard
            label="現状客単価"
            value={formData.avgSpending.toLocaleString()}
            unit="円"
            icon="💰"
          />
        </div>

        {/* Sales Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">売上比較</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">想定売上</span>
                <span className="font-bold text-gray-900">¥{projectedSales.toLocaleString()}</span>
              </div>
              <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-end pr-3"
                  style={{ width: `${Math.min((projectedSales / breakEvenSales) * 100, 100)}%` }}
                >
                  <span className="text-white text-xs font-semibold">
                    {achievementRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">損益分岐売上</span>
                <span className="font-bold text-gray-900">¥{breakEvenSales.toLocaleString()}</span>
              </div>
              <div className="h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg flex items-center justify-end pr-3">
                <span className="text-white text-xs font-semibold">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">固定費の内訳</h3>
          
          {/* Donut Chart Visualization */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                {costBreakdown.map((item, index) => {
                  const total = costBreakdown.reduce((sum, i) => sum + Number(i.percentage), 0);
                  const startAngle = costBreakdown.slice(0, index).reduce((sum, i) => sum + (Number(i.percentage) / total) * 360, 0);
                  const angle = (Number(item.percentage) / total) * 360;
                  
                  const radius = 70;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
                  const strokeDashoffset = -((startAngle / 360) * circumference);

                  const colorMap: { [key: string]: string } = {
                    'bg-blue-500': '#3B82F6',
                    'bg-orange-500': '#F97316',
                    'bg-green-500': '#10B981',
                    'bg-gray-400': '#9CA3AF'
                  };

                  return (
                    <circle
                      key={index}
                      cx="96"
                      cy="96"
                      r={radius}
                      fill="none"
                      stroke={colorMap[item.color]}
                      strokeWidth="35"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600">固定費合計</p>
                <p className="text-xl font-bold text-gray-900">
                  ¥{(totalFixedCost / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{item.percentage}%</p>
                  <p className="text-sm text-gray-600">¥{item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk Analysis */}
        <div className={`rounded-xl p-6 border-2 ${
          risk.color === 'red' ? 'bg-red-50 border-red-500' :
          risk.color === 'amber' ? 'bg-amber-50 border-amber-500' :
          'bg-green-50 border-green-500'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              risk.color === 'red' ? 'bg-red-500' :
              risk.color === 'amber' ? 'bg-amber-500' :
              'bg-green-500'
            }`}>
              <span className="text-white text-2xl">🤖</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-gray-900">AIリスク分析</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  risk.color === 'red' ? 'bg-red-200 text-red-900' :
                  risk.color === 'amber' ? 'bg-amber-200 text-amber-900' :
                  'bg-green-200 text-green-900'
                }`}>
                  リスク: {risk.label}
                </span>
              </div>
              
              <div className="space-y-3">
                {laborRate > 30 && (
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-semibold text-sm text-gray-900 mb-1">
                      ⚠️ 人件費率が{laborRate.toFixed(0)}%と高めです
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      業界平均30%を目指して、シフト調整で月¥{((laborRate - 30) / 100 * projectedSales).toFixed(0)}削減可能です。
                    </p>
                    <button className="text-orange-600 font-medium text-sm hover:underline flex items-center gap-1">
                      改善策を見る
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {!isAchieved && (
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-semibold text-sm text-gray-900 mb-1">
                      💡 メニュー改善で収益向上
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      原価率の低いメニューを強化することで、月¥{(shortfall * 0.4).toFixed(0)}の改善が見込めます。
                    </p>
                    <Link href="/menu">
                      <button className="text-orange-600 font-medium text-sm hover:underline flex items-center gap-1">
                        メニュー管理で改善
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                )}

                {isAchieved && (
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-semibold text-sm text-green-900 mb-1">
                      ✅ 良好な計画です
                    </p>
                    <p className="text-sm text-gray-700">
                      現在の計画で損益分岐を達成できる見込みです。引き続き売上向上を目指しましょう。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full py-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            PDF出力(銀行提出用)
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/menu">
              <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                メニュー管理へ
              </button>
            </Link>
            <Link href="/cashflow">
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                資金繰り確認
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, unit, icon }: { label: string; value: string | number; unit: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{unit}</p>
    </div>
  );
}
