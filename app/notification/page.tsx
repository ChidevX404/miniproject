'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, PiggyBank, Home, Settings, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// กำหนดหน้าตาข้อมูลให้ตรงกับที่บันทึก
interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
}

// โครงสร้างข้อมูลหลังจัดกลุ่มตามวันที่
interface GroupedTransaction {
  date: string;
  items: Transaction[];
}

export default function NotificationPage() {
  const router = useRouter();
  const [groupedData, setGroupedData] = useState<GroupedTransaction[]>([]);

  useEffect(() => {
    // 1. เช็ค User
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);

    // 2. ดึงข้อมูล Transaction
    const allData = JSON.parse(localStorage.getItem('my_transactions') || '[]');
    
    // 3. กรองของ User นี้ และกลับด้านข้อมูล (ล่าสุดขึ้นก่อน)
    const myData: Transaction[] = allData
      .filter((t: any) => t.userId === currentUser.id)
      .reverse();

    // 4. จัดกลุ่มข้อมูลตามวันที่ (Grouping Logic)
    const groups: GroupedTransaction[] = [];
    const todayStr = new Date().toLocaleDateString('th-TH');

    myData.forEach((item) => {
      // เปลี่ยนชื่อวันที่ปัจจุบันเป็น "วันนี้"
      const dateLabel = item.date === todayStr ? 'วันนี้' : item.date;

      // เช็คว่ามีกลุ่มวันที่นี้หรือยัง
      const existingGroup = groups.find(g => g.date === dateLabel);

      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ date: dateLabel, items: [item] });
      }
    });

    setGroupedData(groups);

  }, [router]);

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24">
      
      {/* --- Header --- */}
      <div className="p-6">
        {/* ใช้ router.back() เพื่อให้กลับไปหน้าก่อนหน้าได้ถูกต้อง */}
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      <div className="px-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">การแจ้งเตือน</h1>
        <p className="text-gray-500 text-sm">ประวัติล่าสุด</p>
      </div>

      {/* --- Notification List --- */}
      <div className="px-6 space-y-8">
        {groupedData.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">ไม่มีประวัติรายการ</div>
        ) : (
          groupedData.map((group, idx) => (
            <div key={idx}>
              {/* วันที่ */}
              <h2 className="text-xl font-medium text-gray-800 mb-4 ml-2">
                {group.date}
              </h2>
              
              {/* รายการในวันนั้นๆ */}
              <div className="space-y-4">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-2xl">
                        {item.type === 'expense' ? (
                          <MinusCircle className="w-6 h-6 text-gray-600" /> // ไอคอนลบสีเทา ตามดีไซน์เดิม
                        ) : (
                          <PlusCircle className="w-6 h-6 text-gray-600" /> // ไอคอนบวกสีเทา
                        )}
                      </div>
                      <div>
                        {/* ชื่อรายการ */}
                        <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                        
                        {/* จำนวนเงิน แยกสี */}
                        <p className={`text-sm font-semibold ${item.type === 'expense' ? 'text-red-400' : 'text-green-500'}`}>
                          {item.type === 'expense' ? '-' : '+'} {item.amount.toLocaleString()} บาท
                        </p>
                      </div>
                    </div>
                    {/* เวลา */}
                    <span className="text-[10px] text-gray-400 self-start mt-1">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <Link href="/pocket" className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/home" className="hover:scale-110 transition-transform">
          <Home className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/setting" className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
      </div>

    </div>
  );
}