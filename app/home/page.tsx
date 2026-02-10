'use client'; 

import React, { useEffect, useState } from 'react';
import { User, Bell, Home, Settings, PiggyBank, PlusCircle, MinusCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. แก้ไข Type: amount เป็น string เพื่อรองรับเลขยาวๆ
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
  
  // --- STATE เก็บข้อมูล (ใช้ BigInt) ---
  // ใช้ BigInt(0) แทน 0n เพื่อความปลอดภัยในบาง Environment
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [expenseTotal, setExpenseTotal] = useState<bigint>(BigInt(0));
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('');

  // --- LOAD DATA ---
  useEffect(() => {
    // ป้องกัน Error ตอน render ฝั่ง Server
    if (typeof window === 'undefined') return;

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

    // 4. คำนวณยอดเงินด้วย BigInt
    let inc = BigInt(0);
    let exp = BigInt(0);
    
    myData.forEach((t: Transaction) => {
      // แปลง string เป็น BigInt (ตัดทศนิยมทิ้ง)
      const amountBigInt = BigInt(t.amount.toString().split('.')[0] || '0');
      
      if (t.type === 'income') inc = inc + amountBigInt;
      else exp = exp + amountBigInt;
    });

    setBalance(inc - exp);
    setExpenseTotal(exp);

    // 5. ดึง 2 รายการล่าสุด
    const recent = [...myData].reverse().slice(0, 2);
    setRecentTransactions(recent);

  }, [router]);

  // --- HELPER FUNCTION: จัดรูปแบบเงิน ---
  const formatMoney = (amount: bigint | string) => {
    try {
        const val = typeof amount === 'string' ? BigInt(amount.split('.')[0]) : amount;
        return val.toLocaleString();
    } catch (e) {
        return amount.toString();
    }
  };

  // --- CHART CONFIG ---
  // หมายเหตุ: Chart.js ต้องการ number เท่านั้น เราจึงต้องแปลง BigInt กลับเป็น number
  // ถ้าเลขเยอะมากๆ กราฟอาจจะไม่แม่นยำ 100% แต่ก็ดีกว่า Error
  const balanceNumber = Number(balance); 
  const expenseNumber = Number(expenseTotal);

  const data = {
    labels: ['คงเหลือ', 'ใช้ไป'],
    datasets: [
      {
        data: [balanceNumber < 0 ? 0 : balanceNumber, expenseNumber], 
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
              {/* 2. แสดงยอดเงินจริง (ใช้ formatMoney และ class truncate เพื่อตัดคำถ้าล้น) */}
              <p className={`text-2xl font-bold max-w-[200px] truncate text-center ${balance < BigInt(0) ? 'text-red-500' : 'text-gray-600'}`}>
                {formatMoney(balance)}
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
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="p-3 bg-white rounded-2xl flex-shrink-0">
                      {item.type === 'income' ? (
                        <PlusCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <MinusCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{item.title}</p>
                      {/* 3. ใช้ formatMoney ตรงนี้ด้วย */}
                      <p className={`font-semibold truncate ${item.type === 'income' ? 'text-green-500' : 'text-red-400'}`}>
                        {item.type === 'income' ? '+' : '-'} {formatMoney(item.amount)} บาท
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 self-start mt-1 flex-shrink-0 ml-2">{item.time}</span>
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