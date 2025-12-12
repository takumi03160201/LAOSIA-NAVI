'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 業態別テンプレート
const templates = {
  cafe: {
    name: 'カフェ',
    seats: 20,
    operatingDays: 26,
    openTime: '10:00',
    closeTime: '18:00',
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
  },
  izakaya: {
    name: '居酒屋',
    seats: 30,
    operatingDays: 26,
    openTime: '17:00',
    closeTime: '24:00',
    rent: 200000,
    utilities: 50000,
    otherFixed: 60000,
    ownerSalary: 300000,
    staffCount: 3,
    hourlyWage: 1200,
    monthlyHours: 180,
    avgSpending: 3500,
    customersPerDay: 50,
    costRate: 35
  },
  restaurant: {
    name: 'レストラン',
    seats: 25,
    operatingDays: 26,
    openTime: '11:00',
    closeTime: '22:00',
    rent: 180000,
    utilities: 40000,
    otherFixed: 55000,
    ownerSalary: 280000,
    staffCount: 3,
    hourlyWage: 1150,
    monthlyHours: 170,
    avgSpending: 2000,
    customersPerDay: 45,
    costRate: 32
  }
};

const TOTAL_STEPS = 5;

export default function SimulationInput() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    storeName: '',
    seats: '',
    operatingDays: '',
    openTime: '',
    closeTime: '',
    rent: '',
    utilities: '',
    otherFixed: '',
    ownerSalary: '',
    staffCount: '',
    hourlyWage: '',
    monthlyHours: '',
    avgSpending: '',
    customersPerDay: '',
    costRate: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (type: string) => {
    const template = templates[type as keyof typeof templates];
    setFormData(prev => ({
      ...prev,
      businessType: type,
      seats: template.seats.toString(),
      operatingDays: template.operatingDays.toString(),
      openTime: template.openTime,
      closeTime: template.closeTime,
      rent: template.rent.toString(),
      utilities: template.utilities.toString(),
      otherFixed: template.otherFixed.toString(),
      ownerSalary: template.ownerSalary.toString(),
      staffCount: template.staffCount.toString(),
      hourlyWage: template.hourlyWage.toString(),
      monthlyHours: template.monthlyHours.toString(),
      avgSpending: template.avgSpending.toString(),
      customersPerDay: template.customersPerDay.toString(),
      costRate: template.costRate.toString()
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/simulation/result');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button onClick={handleBack} disabled={currentStep === 1} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">開業シミュレーション</h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      {/* Progress */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex justify-center gap-2 mb-3">
          {[...Array(TOTAL_STEPS)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i + 1 <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          ステップ {currentStep} / {TOTAL_STEPS}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {currentStep === 1 && (
          <Step1
            formData={formData}
            updateField={updateField}
            applyTemplate={applyTemplate}
          />
        )}
        {currentStep === 2 && (
          <Step2 formData={formData} updateField={updateField} />
        )}
        {currentStep === 3 && (
          <Step3 formData={formData} updateField={updateField} />
        )}
        {currentStep === 4 && (
          <Step4 formData={formData} updateField={updateField} />
        )}
        {currentStep === 5 && (
          <Step5 formData={formData} />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            戻る
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {currentStep === TOTAL_STEPS ? '計算する' : '次へ'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Step1({ formData, updateField, applyTemplate }: any) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">店舗基本情報</h2>
        <p className="text-gray-600">まずは店舗の基本情報を入力してください</p>
      </div>

      <div className="space-y-4">
        <FormField label="業態" required helpText="業態を選ぶと平均値が自動入力されます">
          <select
            value={formData.businessType}
            onChange={(e) => {
              updateField('businessType', e.target.value);
              if (e.target.value) applyTemplate(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="cafe">☕ カフェ</option>
            <option value="izakaya">🍶 居酒屋</option>
            <option value="restaurant">🍽️ レストラン</option>
          </select>
        </FormField>

        {formData.businessType && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">テンプレートを適用しました</p>
              <p>{templates[formData.businessType as keyof typeof templates].name}の平均値を入力済みです。必要に応じて調整してください。</p>
            </div>
          </div>
        )}

        <FormField label="店名" required>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) => updateField('storeName', e.target.value)}
            placeholder="例: カフェ ラオシア"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </FormField>

        <FormField label="席数" required helpText="平均: カフェ15-25席、居酒屋25-35席">
          <input
            type="number"
            value={formData.seats}
            onChange={(e) => updateField('seats', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </FormField>

        <FormField label="営業日数(月)" required helpText="定休日を除いた日数">
          <input
            type="number"
            value={formData.operatingDays}
            onChange={(e) => updateField('operatingDays', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="開店時間" required>
            <input
              type="time"
              value={formData.openTime}
              onChange={(e) => updateField('openTime', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </FormField>
          <FormField label="閉店時間" required>
            <input
              type="time"
              value={formData.closeTime}
              onChange={(e) => updateField('closeTime', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, updateField }: any) {
  const total = Number(formData.rent || 0) + Number(formData.utilities || 0) + Number(formData.otherFixed || 0);
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">固定費</h2>
        <p className="text-gray-600">毎月必ず発生する費用を入力してください</p>
      </div>

      <div className="space-y-4">
        <FormField label="家賃(月)" required helpText="共益費・管理費を含む">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              value={formData.rent}
              onChange={(e) => updateField('rent', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </FormField>

        <FormField label="光熱費(月)" required helpText="電気・ガス・水道">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              value={formData.utilities}
              onChange={(e) => updateField('utilities', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </FormField>

        <FormField label="その他固定費(月)" helpText="通信費、保険料など">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              value={formData.otherFixed}
              onChange={(e) => updateField('otherFixed', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </FormField>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm font-semibold text-orange-900 mb-2">固定費合計</p>
          <p className="text-3xl font-bold text-orange-600">
            ¥{total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, updateField }: any) {
  const totalLaborCost = (Number(formData.ownerSalary || 0) + 
    (Number(formData.staffCount || 0) * Number(formData.hourlyWage || 0) * Number(formData.monthlyHours || 0)));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">人件費</h2>
        <p className="text-gray-600">オーナーとスタッフの人件費を入力してください</p>
      </div>

      <div className="space-y-4">
        <FormField label="オーナー給料(月)" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              value={formData.ownerSalary}
              onChange={(e) => updateField('ownerSalary', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </FormField>

        <FormField label="スタッフ人数" required>
          <input
            type="number"
            value={formData.staffCount}
            onChange={(e) => updateField('staffCount', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </FormField>

        <FormField label="時給" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              value={formData.hourlyWage}
              onChange={(e) => updateField('hourlyWage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </FormField>

        <FormField label="月間労働時間(1人あたり)" required helpText="週40時間 = 月160時間">
          <input
            type="number"
            value={formData.monthlyHours}
            onChange={(e) => updateField('monthlyHours', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </FormField>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm font-semibold text-orange-900 mb-2">人件費合計</p>
          <p className="text-3xl font-bold text-orange-600">
            ¥{totalLaborCost.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, updateField }: any) {
  const monthlySales = Number(formData.avgSpending || 0) * Number(formData.customersPerDay || 0) * Number(formData.operatingDays || 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">売上想定</h2>
        <p className="text-gray-600">想定する売上の条件を入力してください</p>
      </div>

      <div className="space-y-4">
        <FormField label="平均客単価" required helpText="1人あたりの平均支払額">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
