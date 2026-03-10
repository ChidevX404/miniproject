'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, PiggyBank, Home, Settings, MinusCircle, PlusCircle, X, Image as ImageIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// อัปเดตหน้าตาข้อมูลให้ตรงกับ JSON และรองรับ category, note, imageUrl
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
  imageUrl?: string;
}

// โครงสร้างข้อมูลหลังจัดกลุ่มตามวันที่
interface GroupedTransaction {
  date: string;
  items: Transaction[];
}

export default function NotificationPage() {
  const router = useRouter();
  
  // ⭐ State สำหรับเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง
  const [isMounted, setIsMounted] = useState(false);
  
  const [groupedData, setGroupedData] = useState<GroupedTransaction[]>([]);
  
  // --- State สำหรับดูรายละเอียด ---
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    // สั่งให้ isMounted เป็น true ทันทีที่โหลดหน้าจอฝั่ง Client เสร็จ
    setIsMounted(true);
    fetchData();
  }, [router]);

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
      
      const myData: Transaction[] = allData.filter((t: any) => t.userId === currentUser.id);

      const groups: GroupedTransaction[] = [];
      const today = new Date();
      const todayStr = today.toLocaleDateString('th-TH');

      myData.forEach((item) => {
        const dateLabel = item.date === todayStr ? 'วันนี้' : item.date;
        const existingGroup = groups.find(g => g.date === dateLabel);

        if (existingGroup) {
          existingGroup.items.push(item);
        } else {
          groups.push({ date: dateLabel, items: [item] });
        }
      });

      setGroupedData(groups);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const formatMoney = (amount: string) => {
    try {
      const val = BigInt(amount.split('.')[0] || '0');
      return val.toLocaleString();
    } catch (e) {
      return amount;
    }
  };

  const openDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  // ⭐ ดักการแสดงผลตอนกำลังโหลด (เปลี่ยนจากจอเปล่าๆ เป็นหน้าต่าง Loading หมุนๆ)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#E0F7FF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-700 font-medium animate-pulse">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24">
      
      {/* --- Header --- */}
      <div className="p-6">
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
                  <div 
                    key={itemIdx} 
                    onClick={() => openDetail(item)}
                    className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white transition-colors active:scale-95"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-2xl flex-shrink-0">
                        {item.type === 'expense' ? (
                          <MinusCircle className="w-6 h-6 text-gray-600" /> 
                        ) : (
                          <PlusCircle className="w-6 h-6 text-gray-600" /> 
                        )}
                      </div>
                      <div className="min-w-0">
                        {/* ชื่อรายการ */}
                        <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                        
                        {/* แสดง Tag หมวดหมู่ หรือ ไอคอนรูปภาพ (ถ้ามี) */}
                        <div className="flex items-center space-x-2 mt-0.5">
                          {item.category && (
                            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                              {item.category}
                            </span>
                          )}
                          {item.imageUrl && <ImageIcon className="w-3 h-3 text-cyan-500" />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      {/* จำนวนเงิน แยกสี + ใช้ formatMoney */}
                      <p className={`text-sm font-semibold ${item.type === 'expense' ? 'text-red-400' : 'text-green-500'}`}>
                        {item.type === 'expense' ? '-' : '+'} {formatMoney(item.amount)} บาท
                      </p>
                      {/* เวลา */}
                      <span className="text-[10px] text-gray-400 mt-1">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL POPUP: ดูรายละเอียด (ยกมาจากหน้า Pocket) --- */}
      {isDetailModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">รายละเอียดรายการ</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="text-center pb-4 border-b border-gray-100">
                <p className="text-gray-500 text-sm mb-1">{selectedTransaction.title}</p>
                <p className={`text-3xl font-bold ${selectedTransaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedTransaction.type === 'income' ? '+' : '-'} {formatMoney(selectedTransaction.amount)} บาท
                </p>
                <span className="inline-block mt-2 text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {selectedTransaction.category || 'ทั่วไป'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">วันที่</p>
                  <p className="font-medium text-gray-800">{selectedTransaction.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">เวลา</p>
                  <p className="font-medium text-gray-800">{selectedTransaction.time}</p>
                </div>
              </div>

              {selectedTransaction.note && (
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <p className="text-blue-400 text-xs mb-1 flex items-center gap-1"><FileText className="w-3 h-3"/> โน้ตเพิ่มเติม</p>
                  <p className="text-gray-700 text-sm">{selectedTransaction.note}</p>
                </div>
              )}

              {selectedTransaction.imageUrl && (
                <div>
                  <p className="text-gray-400 text-xs mb-2 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> รูปภาพที่แนบ</p>
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <img src={selectedTransaction.imageUrl} alt="Receipt" className="w-full object-contain max-h-48 bg-gray-50" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] z-40">
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