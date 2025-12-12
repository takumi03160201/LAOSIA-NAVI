'use client';

import React, { useState } from 'react';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';

export default function BreakEvenAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // サンプルデータ
  const data = {
    breakEvenSales: 1200000,
    projectedSales: 850000,
    costs: {
      rent: 150000,
      labor: 450000,
      cogs: 255000, // Cost of Goods Sold (変動費)
      utilities: 30000,
      other: 50000
    },
    industry: {
      rent: 40,
      labor: 28,
      cogs: 30,
      utilities: 3,
      other: 4
    }
  };

  const totalCosts = Object.values(data.costs).reduce((a, b) => a + b, 0);
  const fixedCosts = data.costs.rent + data.costs.labor + data.costs.utilities + data.costs.other;
  const achievementRate = (data.projectedSales / data.breakEvenSales) * 100;
  const shortfall = data.breakEvenSales - data.projectedSales;
  const isAchieved = achievementRate >= 100;

  // コスト構成比
  const costBreakdown = [
    { 
      name: '家賃', 
      amount: data.costs.rent, 
      percentage: (data.costs.rent / totalCosts * 100).toFixed(1),
      industryAvg: data.industry.rent,
      color: 'bg-blue-500'
    },
    { 
      name: '人件費', 
      amount: data.costs.labor, 
      percentage: (data.costs.labor / totalCosts * 100).toFixed(1),
      industryAvg: data.industry.labor,
      color: 'bg-orange-500'
    },
    { 
      name: '原価', 
      amount: data.costs.cogs, 
      percentage: (data.costs.cogs / totalCosts * 100).toFixed(1),
      industryAvg: data.industry.cogs,
      color: 'bg-green-500'
    },
    { 
      name: '光熱費', 
      amount: data.costs.utilities, 
      percentage: (data.costs.utilities / totalCosts * 100).toFixed(1),
      industryAvg: data.industry.utilities,
      color: 'bg-purple-500'
    },
    { 
      name: 'その他', 
      amount: data.costs.other, 
      percentage: (data.costs.other / totalCosts * 100).toFixed(1),
      industryAvg: data.industry.other,
      color: 'bg-gray-400'
    }
  ];

  const getStatusIcon = (yourRate: number, industryAvg: number) => {
    const diff = yourRate - industryAvg;
    if (diff > 5) return { icon: AlertCircle, color: 'text-amber-600', text: '高め' };
    if (diff < -5) return { icon: CheckCircle, color: 'text-green-600', text: '優秀' };
    return { icon: CheckCircle, color: 'text-gray-600', text: '適正' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">損益分岐分析</h1>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-20">
        {/* Period Selector */}
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
          {['month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                selectedPeriod === period
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period === 'month' ? '月次' : period === 'quarter' ? '四半期' : '年次'}
            </button>
          ))}
        </div>

        {/* Hero Card */}
        <div className={`rounded-2xl p-6 border-2 ${
          isAchieved 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500' 
            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-500'
        }`}>
          <p className="text-sm text-gray-700 mb-2">損益分岐売上</p>
          <p className="text-4xl font-bold text-gray-900 mb-4">
            ¥{data.breakEvenSales.toLocaleString()}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">予測売上</span>
              <span className="font-semibold">{achievementRate.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isAchieved ? 'bg-green-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(achievementRate, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            <span className="text-sm text-gray-700">現状予測</span>
            <span className="text-xl font-bold text-gray-900">
              ¥{data.projectedSales.toLocaleString()}
            </span>
          </div>
          
          {!isAchieved && (
            <p className="mt-3 text-amber-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              あと¥{shortfall.toLocaleString()}で損益分岐達成
            </p>
          )}
        </div>

        {/* Cost Structure Donut */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">費用構造</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56">
                <svg className="transform -rotate-90 w-56 h-56" viewBox="0 0 200 200">
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
                      'bg-purple-500': '#A855F7',
                      'bg-gray-400': '#9CA3AF'
                    };

                    return (
                      <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={colorMap[item.color]}
                        strokeWidth="40"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-600">総コスト</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{(totalCosts / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{item.percentage}%</p>
                    <p className="text-xs text-gray-600">¥{(item.amount / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Cost Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">業界平均との比較</h3>
          <div className="space-y-4">
            {costBreakdown.map((item, index) => {
              const status = getStatusIcon(Number(item.percentage), item.industryAvg);
              const StatusIcon = status.icon;
              const diff = (Number(item.percentage) - item.industryAvg).toFixed(1);

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      ¥{item.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">あなた</p>
                      <p className="text-lg font-bold text-gray-900">{item.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">業界平均</p>
                      <p className="text-lg font-bold text-gray-900">{item.industryAvg}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">差分</p>
                      <p className={`text-lg font-bold ${
                        Number(diff) > 0 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {Number(diff) > 0 ? '+' : ''}{diff}%
                      </p>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-gray-700"
                      style={{ left: `${item.industryAvg}%` }}
                    />
                  </div>

                  <div className={`flex items-center gap-2 ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{status.text}</span>
                    {Number(diff) > 5 && (
                      <span className="text-xs text-gray-600">
                        (売上比で業界平均より{Math.abs(Number(diff)).toFixed(1)}%高い)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 mb-2">AI改善提案</h4>
              <p className="text-sm text-orange-800 mb-4">
                費用構造を分析した結果、以下の改善が可能です
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {costBreakdown
              .filter(item => Number(item.percentage) > item.industryAvg + 5)
              .map((item, index) => {
                const savingsPotential = (Number(item.percentage) - item.industryAvg) / 100 * data.projectedSales;
                return (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {index + 1}. {item.name}率を{item.industryAvg}%に削減
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          → 月¥{savingsPotential.toLocaleString()}削減可能
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        効果大
                      </span>
                    </div>
                    <button className="text-orange-600 font-medium text-sm hover:underline flex items-center gap-1">
                      改善策を見る
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

            {costBreakdown.filter(item => Number(item.percentage) > item.industryAvg + 5).length === 0 && (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-semibold">良好な費用構造です</p>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  全ての費用項目が業界平均内に収まっています。この調子で運営を続けましょう。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/simulation/input">
            <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              シミュレーション
            </button>
          </Link>
          <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Info className="w-5 h-5" />
            詳細レポート
          </button>
        </div>
      </main>
    </div>
  );
}
