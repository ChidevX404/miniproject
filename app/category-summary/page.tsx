'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Coffee, Car, ShoppingBag, FileText, HelpCircle, X, ChevronRight, Wallet, Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: string;
  type: 'income' | 'expense';
  date: string;
  time: string;
  category?: string;
  note?: string;
}

interface CategorySummary {
  name: string;
  total: bigint;
  percentage: number;
}

// แผนผังไอคอนและสีสำหรับหมวดหมู่ต่างๆ
const CATEGORY_MAP: Record<string, { icon: React.ReactElement, color: string, bg: string }> = {
  // รายจ่าย
  'อาหาร': { icon: <Coffee className="w-6 h-6 text-orange-500" />, color: '#f97316', bg: 'bg-orange-100' },
  'เดินทาง': { icon: <Car className="w-6 h-6 text-blue-500" />, color: '#3b82f6', bg: 'bg-blue-100' },
  'ช้อปปิ้ง': { icon: <ShoppingBag className="w-6 h-6 text-pink-500" />, color: '#ec4899', bg: 'bg-pink-100' },
  'บิล/ค่าเช่า': { icon: <FileText className="w-6 h-6 text-red-500" />, color: '#ef4444', bg: 'bg-red-100' },
  // รายรับ
  'เงินเดือน': { icon: <Wallet className="w-6 h-6 text-green-500" />, color: '#22c55e', bg: 'bg-green-100' },
  'ค้าขาย': { icon: <TrendingUp className="w-6 h-6 text-emerald-500" />, color: '#10b981', bg: 'bg-emerald-100' },
  'เงินคืน': { icon: <Banknote className="w-6 h-6 text-teal-500" />, color: '#14b8a6', bg: 'bg-teal-100' },
  // ทั่วไป
  'ทั่วไป': { icon: <HelpCircle className="w-6 h-6 text-purple-500" />, color: '#8b5cf6', bg: 'bg-purple-100' }
};

const DEFAULT_CAT: { icon: React.ReactElement, color: string, bg: string } = { 
  icon: <HelpCircle className="w-6 h-6 text-gray-500" />, 
  color: '#9ca3af', 
  bg: 'bg-gray-100' 
};

export default function CategorySummaryPage() {
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense'); // ⭐ เพิ่ม State สลับโหมด
  
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [grandTotal, setGrandTotal] = useState<bigint>(BigInt(0));
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  // ⭐ เมื่อเปลี่ยน Tab ให้ทำการประมวลผลข้อมูลใหม่
  useEffect(() => {
    processSummary(allTransactions, activeTab);
  }, [activeTab, allTransactions]);

  const fetchData = async () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);

    try {
      const res = await fetch('/api/transaction');
      const allData = await res.json();
      const myData = allData.filter((t: Transaction) => t.userId === currentUser.id);
      setAllTransactions(myData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const processSummary = (data: Transaction[], mode: 'income' | 'expense') => {
    const filtered = data.filter(t => t.type === mode);
    
    let totalSum = BigInt(0);
    const totalsByCategory: Record<string, bigint> = {};

    filtered.forEach((t) => {
      const amt = BigInt(t.amount?.toString().split('.')[0] || '0');
      totalSum += amt;
      const catName = t.category || 'ทั่วไป';
      if (!totalsByCategory[catName]) totalsByCategory[catName] = BigInt(0);
      totalsByCategory[catName] += amt;
    });

    const summaryArray: CategorySummary[] = Object.keys(totalsByCategory).map(key => {
      const total = totalsByCategory[key];
      const percentage = totalSum > BigInt(0) ? (Number(total) / Number(totalSum)) * 100 : 0;
      return { name: key, total, percentage };
    });

    summaryArray.sort((a, b) => Number(b.total) - Number(a.total));
    setGrandTotal(totalSum);
    setCategories(summaryArray);
  };

  const formatMoney = (amount: bigint | string) => {
    try {
        const val = typeof amount === 'string' ? BigInt(amount.split('.')[0]) : amount;
        return val.toLocaleString();
    } catch (e) {
        return amount.toString();
    }
  };

  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => Number(c.total)),
        backgroundColor: categories.map(c => CATEGORY_MAP[c.name]?.color || DEFAULT_CAT.color),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '80%',
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const activeModalData = selectedCategory ? (CATEGORY_MAP[selectedCategory] || DEFAULT_CAT) : DEFAULT_CAT;

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#E0F7FF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-700 font-medium animate-pulse">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24 relative overflow-x-hidden">
      
      {/* Header */}
      <div className="p-6 flex items-center relative">
        <button onClick={() => router.back()} className="absolute left-6">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 w-full text-center">สรุปหมวดหมู่</h1>
      </div>

      <div className="px-6 flex-grow flex flex-col mt-2">
        
        {/* ⭐ Tab Switcher */}
        <div className="flex bg-white/50 backdrop-blur-sm rounded-2xl p-1.5 mb-8 shadow-inner border border-white/20">
          <button 
            onClick={() => setActiveTab('expense')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>รายจ่าย</span>
          </button>
          <button 
            onClick={() => setActiveTab('income')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'income' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>รายรับ</span>
          </button>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center mb-8 relative border border-gray-50">
          {categories.length > 0 ? (
            <div className="relative w-56 h-56 flex items-center justify-center">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                  {activeTab === 'expense' ? 'รวมรายจ่าย' : 'รวมรายรับ'}
                </p>
                <p className={`text-2xl font-bold mt-1 ${activeTab === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                  {formatMoney(grandTotal)}
                </p>
                <p className="text-[10px] text-gray-300">บาท</p>
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <p className="text-gray-400 italic">ไม่มีข้อมูล{activeTab === 'expense' ? 'รายจ่าย' : 'รายรับ'}</p>
            </div>
          )}
        </div>

        {/* Category List */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 ml-2 flex items-center">
            สัดส่วน{activeTab === 'expense' ? 'การใช้จ่าย' : 'การรับเงิน'}
          </h2>
          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-8">ยังไม่มีรายการ</p>
            ) : (
              categories.map((cat, index) => {
                const mapData = CATEGORY_MAP[cat.name] || DEFAULT_CAT;
                return (
                  <div 
                    key={index} 
                    onClick={() => setSelectedCategory(cat.name)}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm border border-gray-50 cursor-pointer hover:bg-white transition-all active:scale-95"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl ${mapData.bg}`}>{mapData.icon}</div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{cat.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{cat.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-right">
                      <div>
                        <p className={`text-[15px] font-bold ${activeTab === 'expense' ? 'text-gray-700' : 'text-green-600'}`}>
                          {activeTab === 'expense' ? '-' : '+'} {formatMoney(cat.total)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">บาท</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL POPUP */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${activeModalData.bg}`}>
                  {React.cloneElement(activeModalData.icon, { className: 'w-5 h-5' } as React.HTMLAttributes<HTMLOrSVGElement>)}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{selectedCategory}</h3>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1.5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto space-y-3 pr-1 -mr-1 custom-scrollbar">
              {allTransactions
                .filter(t => t.type === activeTab && (t.category || 'ทั่วไป') === selectedCategory)
                .map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-medium text-gray-800 text-[13px] truncate">{item.title}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">{item.date} • {item.time}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-semibold ${item.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                        {item.type === 'expense' ? '-' : '+'} {formatMoney(item.amount)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}