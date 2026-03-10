'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Calendar, Search, MinusCircle, PlusCircle, ArrowRight, X, Image as ImageIcon, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  imageUrl?: string; // เพิ่มรองรับรูปภาพ
}

export default function RetrospectivePage() {
  const router = useRouter();
  
  // ⭐ State สำหรับเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง (แก้จอแดง Hydration Error)
  const [isMounted, setIsMounted] = useState(false);

  // --- STATE ข้อมูล ---
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState<bigint>(BigInt(0));
  const [totalExpense, setTotalExpense] = useState<bigint>(BigInt(0));

  // --- STATE ตัวกรองวันที่ ---
  const [filterMode, setFilterMode] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- STATE สำหรับดูรายละเอียด Modal ---
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // โหลดข้อมูลทั้งหมดในตอนแรก
  useEffect(() => {
    // ⭐ สั่งให้ isMounted เป็น true ทันทีที่โหลดหน้าจอฝั่ง Client เสร็จ
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
      
      const myData = allData.filter((t: any) => t.userId === currentUser.id);
      setAllTransactions(myData);
      
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  // --- ระบบคัดกรองข้อมูลตามวันที่ ---
  useEffect(() => {
    let filtered = allTransactions;

    const parseThaiDate = (dateStr: string) => {
      if (!dateStr) return 0;
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        let y = parseInt(parts[2], 10);
        if (y > 2500) y -= 543;
        return new Date(y, m, d).setHours(0, 0, 0, 0);
      }
      return 0;
    };

    const parseInputDate = (dateStr: string) => {
      if (!dateStr) return null;
      const [y, m, d] = dateStr.split('-');
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10)).setHours(0, 0, 0, 0);
    };

    if (filterMode === 'single' && singleDate) {
      const targetTime = parseInputDate(singleDate);
      filtered = allTransactions.filter(t => parseThaiDate(t.date) === targetTime);
    } 
    else if (filterMode === 'range' && startDate && endDate) {
      const sTime = parseInputDate(startDate);
      const eTime = parseInputDate(endDate);
      if (sTime !== null && eTime !== null) {
        filtered = allTransactions.filter(t => {
          const tTime = parseThaiDate(t.date);
          return tTime >= sTime && tTime <= eTime;
        });
      }
    }

    setFilteredTransactions(filtered);

    let inc = BigInt(0);
    let exp = BigInt(0);
    filtered.forEach(t => {
      const amt = BigInt(t.amount.split('.')[0] || '0');
      if (t.type === 'income') inc += amt;
      else exp += amt;
    });

    setTotalIncome(inc);
    setTotalExpense(exp);

  }, [allTransactions, filterMode, singleDate, startDate, endDate]);

  const formatMoney = (amount: bigint | string) => {
    try {
        const val = typeof amount === 'string' ? BigInt(amount.split('.')[0]) : amount;
        return val.toLocaleString();
    } catch (e) {
        return amount.toString();
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่างรายละเอียด ---
  const openDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  // ⭐ ดักการแสดงผลตอนกำลังโหลด (โชว์ Loading หมุนๆ แบบเดียวกับหน้าอื่นๆ)
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
      
      {/* --- Header --- */}
      <div className="p-6 flex items-center relative">
        <button onClick={() => router.back()} className="absolute left-6">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 w-full text-center">สรุปย้อนหลัง</h1>
      </div>

      <div className="px-6 flex-grow flex flex-col">
        
        {/* --- Card ตัวกรองวันที่ --- */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-gray-700 font-medium">
            <Search className="w-5 h-5 text-cyan-500" />
            <h2>เลือกช่วงเวลาที่ต้องการดู</h2>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button 
              onClick={() => setFilterMode('single')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${filterMode === 'single' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ดูแบบรายวัน
            </button>
            <button 
              onClick={() => setFilterMode('range')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${filterMode === 'range' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ดูแบบช่วงเวลา
            </button>
          </div>

          {filterMode === 'single' ? (
            <div>
              <p className="text-[11px] text-gray-400 mb-1 ml-1">เลือกวันที่</p>
              <input 
                type="date" 
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="w-full bg-gray-50 p-3 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
          ) : (
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <p className="text-[11px] text-gray-400 mb-1 ml-1">ตั้งแต่วันที่</p>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200"
                />
              </div>
              {/* จัดลูกศรให้อยู่กึ่งกลางกล่อง Input (ชดเชยพื้นที่ Label ด้านบนด้วย pb-4) */}
              <div className="pb-4 flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-gray-400 mb-1 ml-1">ถึงวันที่</p>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* --- Income / Expense Summary ของช่วงเวลานั้น --- */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-50">
            <p className="text-[11px] font-medium text-gray-400 mb-2">รายรับช่วงนี้ (บาท)</p>
            <p className="text-xl font-bold text-green-500 truncate">{formatMoney(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-50">
            <p className="text-[11px] font-medium text-gray-400 mb-2">รายจ่ายช่วงนี้ (บาท)</p>
            <p className="text-xl font-bold text-red-500 truncate">{formatMoney(totalExpense)}</p>
          </div>
        </div>

        {/* --- Transaction List --- */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 ml-2">รายการที่พบ</h2>
          
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 flex flex-col items-center justify-center border border-gray-50">
                <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-center text-gray-400 text-sm">ไม่พบรายการในช่วงเวลาที่เลือก</p>
                <p className="text-center text-gray-300 text-[10px] mt-1">กรุณาเลือกวันที่ด้านบนเพื่อดูสรุป</p>
              </div>
            ) : (
              filteredTransactions.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openDetail(item)} // เพิ่มฟังก์ชันคลิก
                  className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm border border-gray-50 cursor-pointer hover:bg-white transition-colors active:scale-95"
                >
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
                      
                      {/* แท็กหมวดหมู่ และ ไอคอนรูปภาพ */}
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                          {item.category || 'ทั่วไป'}
                        </span>
                        {item.imageUrl && <ImageIcon className="w-3 h-3 text-cyan-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 ml-2">
                    <p className={`text-sm font-semibold truncate ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.type === 'income' ? '+' : '-'} {formatMoney(item.amount)}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1">{item.date} • {item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP: ดูรายละเอียด --- */}
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

    </div>
  );
}