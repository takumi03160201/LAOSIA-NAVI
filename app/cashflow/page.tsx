'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

export default function CashFlowCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); // 2025年1月

  // サンプル資金繰りデータ
  const events: { [key: string]: Array<{ type: 'in' | 'out'; name: string; amount: number; alert?: boolean }> } = {
    '2025-01-05': [{ type: 'in', name: '売上入金', amount: 450000 }],
    '2025-01-10': [{ type: 'out', name: '家賃支払い', amount: 150000 }],
    '2025-01-15': [
      { type: 'in', name: '売上入金', amount: 380000 },
      { type: 'out', name: '仕入れ代金', amount: 120000 }
    ],
    '2025-01-20': [{ type: 'out', name: '給与支払い', amount: 450000 }],
    '2025-01-25': [
      { type: 'in', name: '売上入金', amount: 420000 },
      { type: 'out', name: '光熱費', amount: 30000 }
    ],
    '2025-01-31': [{ type: 'out', name: 'ローン返済', amount: 80000 }],
    
    '2025-02-05': [{ type: 'in', name: '売上入金', amount: 460000 }],
    '2025-02-10': [{ type: 'out', name: '家賃支払い', amount: 150000 }],
    '2025-02-15': [
      { type: 'in', name: '売上入金', amount: 390000 },
      { type: 'out', name: '仕入れ代金', amount: 130000 }
    ],
    '2025-02-20': [{ type: 'out', name: '給与支払い', amount: 450000, alert: true }],
    '2025-02-25': [{ type: 'in', name: '売上入金', amount: 350000 }],
    '2025-02-28': [{ type: 'out', name: 'ローン返済', amount: 80000 }],

    '2025-03-05': [{ type: 'in', name: '売上入金', amount: 480000 }],
    '2025-03-10': [{ type: 'out', name: '家賃支払い', amount: 150000 }],
    '2025-03-15': [{ type: 'in', name: '売上入金', amount: 410000 }],
    '2025-03-20': [{ type: 'out', name: '給与支払い', amount: 450000, alert: true }],
    '2025-03-25': [{ type: 'in', name: '売上入金', amount: 300000, alert: true }],
    '2025-03-31': [{ type: 'out', name: 'ローン返済', amount: 80000 }]
  };

  // 残高計算（開始残高2,300,000円）
  const calculateBalance = (dateStr: string) => {
    let balance = 2300000;
    const targetDate = new Date(dateStr);
    
    Object.keys(events).sort().forEach(eventDate => {
      if (new Date(eventDate) <= targetDate) {
        events[eventDate].forEach(event => {
          if (event.type === 'in') {
            balance += event.amount;
          } else {
            balance -= event.amount;
          }
        });
      }
    });
    
    return balance;
  };

  // 月の日数を取得
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 月の最初の曜日を取得
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // 前月・次月
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  // カレンダーのグリッド生成
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 月末残高
  const endOfMonthBalance = calculateBalance(
    `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${daysInMonth}`
  );

  const getBalanceStatus = (balance: number) => {
    if (balance < 500000) return { color: 'red', label: '危険', icon: AlertTriangle };
    if (balance < 1000000) return { color: 'amber', label: '注意', icon: TrendingDown };
    return { color: 'green', label: '安全', icon: DollarSign };
  };

  const endMonthStatus = getBalanceStatus(endOfMonthBalance);
  const StatusIcon = endMonthStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">資金繰りカレンダー</h1>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl pb-20">
        {/* Summary Card */}
        <div className={`rounded-xl p-6 border-2 ${
          endMonthStatus.color === 'red' ? 'bg-red-50 border-red-500' :
          endMonthStatus.color === 'amber' ? 'bg-amber-50 border-amber-500' :
          'bg-green-50 border-green-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${
                endMonthStatus.color === 'red' ? 'text-red-600' :
                endMonthStatus.color === 'amber' ? 'text-amber-600' :
                'text-green-600'
              }`} />
              <div>
                <p className="text-sm text-gray-700">月末予測残高</p>
                <p className="text-3xl font-bold text-gray-900">
                  ¥{endOfMonthBalance.toLocaleString()}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full font-bold text-sm ${
              endMonthStatus.color === 'red' ? 'bg-red-200 text-red-900' :
              endMonthStatus.color === 'amber' ? 'bg-amber-200 text-amber-900' :
              'bg-green-200 text-green-900'
            }`}>
              {endMonthStatus.label}
            </span>
          </div>

          {endOfMonthBalance < 1000000 && (
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                ⚠️ 資金繰り注意報
              </p>
              <p className="text-sm text-gray-700">
                {endMonthStatus.color === 'red' 
                  ? '資金が危険水準です。早急に対策が必要です。'
                  : '運転資金が減少しています。入金サイクルの見直しを検討してください。'
                }
              </p>
            </div>
          )}
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Weekday Headers */}
            {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
              <div key={i} className="text-center py-2 text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = events[dateStr] || [];
              const balance = calculateBalance(dateStr);
              const hasAlert = dayEvents.some(e => e.alert);

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 hover:shadow-md transition-shadow ${
                    hasAlert ? 'border-red-300 bg-red-50' :
                    dayEvents.length > 0 ? 'border-orange-200 bg-orange-50' :
                    'border-gray-200 bg-white'
                  } ${index % 7 === 0 ? 'border-l-4 border-l-red-400' : ''} ${
                    index % 7 === 6 ? 'border-l-4 border-l-blue-400' : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-sm font-semibold ${
                        index % 7 === 0 ? 'text-red-600' :
                        index % 7 === 6 ? 'text-blue-600' :
                        'text-gray-900'
                      }`}>
                        {day}
                      </span>
                      {hasAlert && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                    </div>

                    {dayEvents.length > 0 && (
                      <div className="space-y-1 flex-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((event, i) => (
                          <div
                            key={i}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${
                              event.type === 'in'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {event.type === 'in' ? '↑' : '↓'} ¥{(event.amount / 1000).toFixed(0)}K
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2}件
                          </div>
                        )}
                      </div>
                    )}

                    {dayEvents.length > 0 && (
                      <div className="text-xs text-gray-600 mt-auto pt-1 border-t border-gray-200">
                        残¥{(balance / 1000).toFixed(0)}K
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">今月の予定</h3>
          <div className="space-y-3">
            {Object.keys(events)
              .filter(dateStr => {
                const date = new Date(dateStr);
                return date.getMonth() === currentMonth.getMonth() &&
                       date.getFullYear() === currentMonth.getFullYear();
              })
              .sort()
              .map(dateStr => {
                const date = new Date(dateStr);
                const dayEvents = events[dateStr];
                const balance = calculateBalance(dateStr);
                const balanceStatus = getBalanceStatus(balance);

                return (
                  <div key={dateStr} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {date.getDate()}日 ({['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})
                        </p>
                        <p className="text-xs text-gray-600">
                          残高: ¥{balance.toLocaleString()}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            balanceStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                            balanceStatus.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {balanceStatus.label}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dayEvents.map((event, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            event.type === 'in'
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          } ${event.alert ? 'ring-2 ring-red-400' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              event.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {event.type === 'in' ? (
                                <TrendingUp className="w-4 h-4 text-white" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{event.name}</p>
                              {event.alert && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  要注意
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${
                            event.type === 'in' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {event.type === 'in' ? '+' : '-'}¥{event.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            💡 資金繰りのヒント
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 残高が100万円を下回る場合は資金調達を検討しましょう</li>
            <li>• 支払いサイトと入金サイトのバランスを意識しましょう</li>
            <li>• 急な出費に備えて運転資金の3ヶ月分は確保しましょう</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
