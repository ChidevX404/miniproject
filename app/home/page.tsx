'use client'; 

import React, { useEffect, useState } from 'react';
import { User, Bell, Home, Settings, PiggyBank, PlusCircle, MinusCircle, ArrowRightLeft } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ลงทะเบียน Component ของ Chart.js ทั้งกราฟวงกลมและกราฟแท่ง
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Type ข้อมูล
interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: string; 
  type: 'income' | 'expense';
  date: string;
  time: string;
}

export default function HomePage() {
  const router = useRouter();
  
  // --- STATE เก็บข้อมูล ---
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [incomeTotal, setIncomeTotal] = useState<bigint>(BigInt(0)); 
  const [expenseTotal, setExpenseTotal] = useState<bigint>(BigInt(0));
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('');
  const [currentMonthName, setCurrentMonthName] = useState('');
  
  // --- STATE สำหรับระบบสลับกราฟ ---
  // 0 = กราฟรายจ่าย (ซ้ายสุด), 1 = ตรงกลาง (วงกลม/แท่งคู่), 2 = กราฟรายรับ (ขวาสุด)
  const [chartIndex, setChartIndex] = useState<number>(1);
  
  // State ย่อยสำหรับ "หน้าตรงกลาง" (สลับระหว่าง วงกลม กับ แท่งคู่)
  const [centerView, setCenterView] = useState<'doughnut' | 'combinedBar'>('doughnut');
  
  // State สำหรับ Swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; 

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        router.push('/login');
        return;
      }
      const currentUser = JSON.parse(userStr);
      setUserName(currentUser.name || 'User');

      try {
        const res = await fetch('/api/transaction');
        const allData = await res.json();
        
        const myData = allData.filter((t: any) => t.userId === currentUser.id);

        const todayStr = new Date().toLocaleDateString('th-TH');
        const todayParts = todayStr.split('/');
        const currentMonth = todayParts[1];
        const currentYear = todayParts[2];

        const monthsFull = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        setCurrentMonthName(monthsFull[parseInt(currentMonth, 10)]);

        const currentMonthData = myData.filter((t: Transaction) => {
          const parts = t.date.split('/');
          return parts[1] === currentMonth && parts[2] === currentYear;
        });

        let inc = BigInt(0);
        let exp = BigInt(0);
        
        currentMonthData.forEach((t: Transaction) => {
          const amountBigInt = BigInt(t.amount.toString().split('.')[0] || '0');
          if (t.type === 'income') inc = inc + amountBigInt;
          else exp = exp + amountBigInt;
        });

        setBalance(inc - exp);
        setIncomeTotal(inc);
        setExpenseTotal(exp);

        const recent = myData.slice(0, 5);
        setRecentTransactions(recent);

      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchData();

  }, [router]);

  // --- HELPER FUNCTION ---
  const formatMoney = (amount: bigint | string) => {
    try {
        const val = typeof amount === 'string' ? BigInt(amount.split('.')[0]) : amount;
        return val.toLocaleString();
    } catch (e) {
        return amount.toString();
    }
  };

  const formatCardDate = (dateStr: string) => {
    const todayStr = new Date().toLocaleDateString('th-TH');
    if (dateStr === todayStr) return 'ล่าสุด'; 

    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const d = parts[0];
      const m = parseInt(parts[1], 10);
      const y = parts[2].slice(-2); 
      const months = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      return `${d} ${months[m]} ${y}`;
    }
    return dateStr;
  };

  // --- SWIPE HANDLERS ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // ถ้าปัดนิ้วไปทางซ้าย (ดูรายรับ)
    if (isLeftSwipe) {
      setChartIndex((prev) => Math.min(prev + 1, 2));
    }
    // ถ้าปัดนิ้วไปทางขวา (ดูรายจ่าย)
    if (isRightSwipe) {
      setChartIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // --- CHART CONFIGS ---
  const balanceNumber = Number(balance); 
  const incomeNumber = Number(incomeTotal);
  const expenseNumber = Number(expenseTotal);

  // 1. วงกลม (หน้ากลาง)
  const doughnutData = {
    labels: ['คงเหลือ', 'ใช้ไป'],
    datasets: [{
      data: [balanceNumber < 0 ? 0 : balanceNumber, expenseNumber], 
      backgroundColor: ['#22c55e', '#ef4444'], 
      borderWidth: 0,
    }],
  };
  const doughnutOptions = {
    cutout: '85%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    maintainAspectRatio: false,
  };

  // 2. แท่งรวมรายรับ-รายจ่าย (หน้ากลางเวลากด Switch)
  const combinedBarData = {
    labels: ['รายรับ', 'รายจ่าย'],
    datasets: [{
      data: [incomeNumber, expenseNumber],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderRadius: 8,
      maxBarThickness: 80,
    }],
  };

  // 3. แท่งรายรับ (ปัดซ้าย)
  const incomeBarData = {
    labels: ['รายรับ'],
    datasets: [{
      data: [incomeNumber],
      backgroundColor: ['#22c55e'],
      borderRadius: 8,
      maxBarThickness: 60,
    }],
  };

  // 4. แท่งรายจ่าย (ปัดขวา)
  const expenseBarData = {
    labels: ['รายจ่าย'],
    datasets: [{
      data: [expenseNumber],
      backgroundColor: ['#ef4444'],
      borderRadius: 8,
      maxBarThickness: 60,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: true, color: '#f3f4f6' }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-20 overflow-x-hidden">
      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between p-6">
        <Link href="/profile">
          <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2 pr-4">
            <User className="w-6 h-6 text-gray-700" />
            <span className="text-xs font-medium text-gray-600">สวัสดี, {userName}</span>
          </div>
        </Link>
        <Link href="/notification" className="relative">
          <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#E0F7FF]"></span>
        </Link>
      </div>

      {/* --- Main Content --- */}
      <div className="px-6 flex-grow">
        
        {/* Balance Card พร้อมระบบ Swipe & Button Toggle */}
        <div 
          className="bg-white rounded-[3rem] p-8 shadow-sm flex flex-col items-center justify-center h-80 relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* จุดไข่ปลาบอกตำแหน่งหน้า (คลิกได้) */}
          <div className="absolute top-6 flex space-x-2 z-20">
            <button onClick={() => setChartIndex(0)} className={`w-2 h-2 rounded-full transition-colors duration-300 ${chartIndex === 0 ? 'bg-red-400' : 'bg-gray-200'}`} />
            <button onClick={() => setChartIndex(1)} className={`w-2 h-2 rounded-full transition-colors duration-300 ${chartIndex === 1 ? 'bg-cyan-400' : 'bg-gray-200'}`} />
            <button onClick={() => setChartIndex(2)} className={`w-2 h-2 rounded-full transition-colors duration-300 ${chartIndex === 2 ? 'bg-green-400' : 'bg-gray-200'}`} />
          </div>

          {/* ปุ่มสลับกราฟมุมขวาล่าง (โชว์เฉพาะหน้าตรงกลาง chartIndex === 1 เท่านั้น) */}
          {chartIndex === 1 && (
            <button 
              onClick={() => setCenterView((prev) => prev === 'doughnut' ? 'combinedBar' : 'doughnut')} 
              className="absolute bottom-4 right-4 p-2 rounded-xl text-gray-800 hover:bg-gray-100 transition-colors active:scale-95 z-20"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="w-full h-full mt-4 flex items-center justify-center relative">
            
            {/* หน้า 0: กราฟรายจ่าย (ปัดขวามาเจอ) */}
            {chartIndex === 0 && (
              <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="text-center mb-4 mt-2">
                  <p className="text-red-500 font-medium text-lg">รายจ่าย</p>
                  <p className="text-[10px] text-gray-400">เดือน{currentMonthName}</p>
                </div>
                <div className="flex-grow relative w-full px-4 pb-2">
                  <Bar data={expenseBarData} options={barOptions} />
                </div>
              </div>
            )}

            {/* หน้า 1: ตรงกลาง (สลับระหว่าง วงกลม / แท่งคู่) */}
            {chartIndex === 1 && (
              <>
                {centerView === 'doughnut' ? (
                  <div className="relative w-64 h-64 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-full h-full">
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-gray-700 font-medium text-lg">ยอดเงินคงเหลือ</p>
                      <p className="text-[10px] text-gray-400 mb-1">เดือน{currentMonthName}</p>
                      <p className={`text-2xl font-semibold max-w-[200px] truncate text-center ${balance < BigInt(0) ? 'text-red-500' : 'text-gray-600'}`}>
                        {formatMoney(balance)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
                    <div className="text-center mb-4 mt-2">
                      <p className="text-gray-800 font-medium text-lg">รายรับ - รายจ่าย</p>
                      <p className="text-[10px] text-gray-400">เดือน{currentMonthName}</p>
                    </div>
                    <div className="flex-grow relative w-full px-4 pb-2">
                      <Bar data={combinedBarData} options={barOptions} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* หน้า 2: กราฟรายรับ (ปัดซ้ายมาเจอ) */}
            {chartIndex === 2 && (
              <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-4 mt-2">
                  <p className="text-green-500 font-medium text-lg">รายรับ</p>
                  <p className="text-[10px] text-gray-400">เดือน{currentMonthName}</p>
                </div>
                <div className="flex-grow relative w-full px-4 pb-2">
                  <Bar data={incomeBarData} options={barOptions} />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
               <p className="text-center text-gray-400 text-sm mt-8">ยังไม่มีรายการ</p>
            ) : (
              recentTransactions.map((item, index) => {
                const currentHeader = formatCardDate(item.date);
                const prevHeader = index > 0 ? formatCardDate(recentTransactions[index - 1].date) : null;
                const showHeader = currentHeader !== prevHeader;

                return (
                  <React.Fragment key={item.id}>
                    {showHeader && (
                       <h2 className="text-lg font-medium text-gray-800 mb-3 ml-2 mt-6">{currentHeader}</h2>
                    )}

                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white transition-colors active:scale-95 mb-3">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="p-3 bg-white rounded-2xl flex-shrink-0">
                          {item.type === 'income' ? (
                            <PlusCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <MinusCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                          <p className={`text-sm mt-0.5 truncate font-medium ${item.type === 'income' ? 'text-green-500' : 'text-red-400'}`}>
                            {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)} บาท
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 self-start mt-1 flex-shrink-0 ml-2">{item.time}</span>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <Link href="/pocket" className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>
        <div className="hover:scale-110 transition-transform p-2 bg-white/50 rounded-full">
          <Home className="w-8 h-8 text-gray-900" />
        </div>
        <Link href="/setting" className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
      </div>
    </div>
  );
}