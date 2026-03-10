'use client';

import { useState, useEffect } from 'react';

// กำหนดโครงสร้างข้อมูลให้ตรงกับที่คุณออกแบบไว้
interface Transaction {
  title?: string;
  amount?: string | number;
  type?: string;
  date?: string;
  time?: string;
}

export default function TransactionPage() {
  // ⭐ State สำหรับเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง (แก้ปัญหาจอแดง Hydration Error)
  const [isMounted, setIsMounted] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก API (/api/transaction)
  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transaction');
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // สั่งให้ดึงข้อมูลทันทีเมื่อเปิดหน้านี้ขึ้นมา
  useEffect(() => {
    // ⭐ สั่งให้ isMounted เป็น true ทันทีที่โหลดหน้าจอฝั่ง Client เสร็จ
    setIsMounted(true);
    fetchTransactions();
  }, []);

  // ⭐ แสดงหน้าต่าง Loading วงกลมหมุนๆ ระหว่างโหลด หรือยังไม่ Mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-700 font-medium animate-pulse">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">หน้าจัดการธุรกรรม (Transactions)</h1>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">รายการทั้งหมดในระบบ</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 text-sm animate-pulse">กำลังดึงข้อมูล...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">ยังไม่มีข้อมูลธุรกรรมในระบบ</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {transactions.map((tx, index) => (
                <li key={index} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{tx.title || 'ไม่ระบุชื่อรายการ'}</p>
                    <p className="text-xs text-gray-500 mt-1">{tx.date} • {tx.time}</p>
                  </div>
                  <div className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount || 0} บาท
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}