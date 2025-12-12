'use client';

import { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Bot } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MenuDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { menus } = useStore();
  const menu = menus.find(m => m.id === params.id);

  const [price, setPrice] = useState(menu?.price || 0);
  const [ingredients, setIngredients] = useState(menu?.ingredients || []);
  const [simulatedPrice, setSimulatedPrice] = useState(menu?.price || 0);

  if (!menu) {
    return <div className="p-6">メニューが見つかりません</div>;
  }

  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.unitPrice), 0);
  const profit = price - totalCost;
  const costRate = (totalCost / price) * 100;

  const simulatedProfit = simulatedPrice - totalCost;
  const simulatedCostRate = (totalCost / simulatedPrice) * 100;
  const profitImprovement = simulatedProfit - profit;

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/menu">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">{menu.name}</h1>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
          保存
        </button>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-20">
        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">販売価格</p>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="text-2xl font-bold text-gray-900 text-center w-full border-b-2 border-transparent hover:border-orange-300 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">原価</p>
              <p className="text-2xl font-bold text-orange-600">¥{totalCost}</p>
              <p className="text-xs text-gray-500">({costRate.toFixed(0)}%)</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">粗利</p>
              <p className="text-2xl font-bold text-green-600">¥{profit}</p>
            </div>
          </div>

          {/* Cost Rate Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">原価率</span>
              <span className={`text-xs font-semibold ${costRate >= 40 ? 'text-red-600' : costRate >= 30 ? 'text-amber-600' : 'text-green-600'}`}>
                {costRate.toFixed(1)}%
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${Math.min(costRate, 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                  costRate >= 40 ? 'bg-red-500' : costRate >= 30 ? 'bg-amber-500' : 'bg-green-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">材料</h3>
          <div className="space-y-3">
            {ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                <div className="flex-1 grid grid-cols-5 gap-2 items-center text-sm">
                  <input
                    value={ing.name}
                    className="col-span-2 bg-transparent font-medium border-none focus:outline-none"
                    readOnly
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{ing.quantity}</span>
                    <span className="text-gray-500">{ing.unit}</span>
                  </div>
                  <span className="text-gray-600">× ¥{ing.unitPrice}</span>
                  <span className="font-semibold text-right">= ¥{ing.quantity * ing.unitPrice}</span>
                </div>
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            材料を追加
          </button>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="font-semibold text-gray-700">合計原価</span>
            <span className="text-3xl font-bold text-orange-600">¥{totalCost}</span>
          </div>
        </div>

        {/* Simulation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">値上げシミュレーション</h3>
          <p className="text-sm text-gray-600 mb-4">販売価格を変更してみる</p>

          <input
            type="range"
            min={price - 200}
            max={price + 500}
            step={10}
            value={simulatedPrice}
            onChange={(e) => setSimulatedPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
            <span>¥{price - 200}</span>
            <span>¥{price + 500}</span>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
            <p className="text-xl font-bold text-blue-900 mb-3">
              ¥{simulatedPrice.toLocaleString()}
              <span className="text-sm font-normal text-blue-700 ml-2">
                ({simulatedPrice > price ? '+' : ''}{simulatedPrice - price}円)
              </span>
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">粗利</span>
                <span className="font-semibold text-blue-900">
                  ¥{simulatedProfit}
                  <span className={`ml-2 ${profitImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({profitImprovement >= 0 ? '+' : ''}{profitImprovement}円)
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">原価率</span>
                <span className="font-semibold text-blue-900">
                  {simulatedCostRate.toFixed(1)}%
                  <span className={`ml-2 ${simulatedCostRate < costRate ? 'text-green-600' : 'text-red-600'}`}>
                    ({(simulatedCostRate - costRate).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Advice */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-orange-900 mb-2">改善提案</p>
              <p className="text-sm text-orange-800">
                パスタを業務用(¥1.5/g)に変更すると原価を¥50削減できます。原価率が38%に改善します。
              </p>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button className="w-full py-3 border-2 border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
          このメニューを削除
        </button>
      </main>
    </div>
  );
}
