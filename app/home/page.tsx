'use client'; 

import React, { useEffect, useState } from 'react';
import { User, Bell, Home, Settings, PiggyBank, PlusCircle, MinusCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);

// กำหนด Type ของข้อมูล Transaction ให้ตรงกัน
interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
}

export default function HomePage() {
  const router = useRouter();
  
  // --- STATE เก็บข้อมูล ---
  const [balance, setBalance] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('');

  // --- LOAD DATA ---
  useEffect(() => {
    // 1. เช็คว่า Login หรือยัง
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    setUserName(currentUser.name || 'User');

    // 2. ดึงข้อมูล Transaction ทั้งหมด
    const allData = JSON.parse(localStorage.getItem('my_transactions') || '[]');
    
    // 3. กรองเฉพาะของ User คนนี้
    const myData = allData.filter((t: any) => t.userId === currentUser.id);

    // 4. คำนวณยอดเงิน
    let inc = 0;
    let exp = 0;
    myData.forEach((t: Transaction) => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });

    setBalance(inc - exp);
    setExpenseTotal(exp);

    // 5. ดึง 2 รายการล่าสุด (เรียงจากหลังไปหน้า)
    const recent = [...myData].reverse().slice(0, 2);
    setRecentTransactions(recent);

  }, [router]);

  // --- CHART CONFIG ---
  const data = {
    labels: ['คงเหลือ', 'ใช้ไป'],
    datasets: [
      {
        data: [balance < 0 ? 0 : balance, expenseTotal], // ป้องกันกราฟ error ถ้ายอดติดลบ
        backgroundColor: ['#22c55e', '#ef4444'], // เขียว / แดง
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '85%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-20">
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
        {/* Balance Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-sm flex flex-col items-center justify-center h-80 relative">
          
          <div className="relative w-64 h-64">
            <Doughnut data={data} options={options} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-gray-700 font-medium text-lg">ยอดเงินคงเหลือ</p>
              {/* แสดงยอดเงินจริง */}
              <p className={`text-2xl font-bold ${balance < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4 ml-2">ล่าสุด</h2>
          
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
               <p className="text-center text-gray-400 text-sm">ยังไม่มีรายการ</p>
            ) : (
              recentTransactions.map((item) => (
                <div key={item.id} className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-2xl">
                      {item.type === 'income' ? (
                        <PlusCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <MinusCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className={`font-semibold ${item.type === 'income' ? 'text-green-500' : 'text-red-400'}`}>
                        {item.type === 'income' ? '+' : '-'} {item.amount.toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 self-start mt-1">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        
        {/* ปุ่มหมูออมสินไปหน้า Pocket */}
        <Link href="/pocket" className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>

        {/* ปุ่ม Home (Current) */}
        <div className="hover:scale-110 transition-transform p-2 bg-white/50 rounded-full">
          <Home className="w-8 h-8 text-gray-900" />
        </div>

        {/* ปุ่มเฟืองไปหน้า Setting */}
        <Link href="/setting" className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
        
      </div>
    </div>
  );
}