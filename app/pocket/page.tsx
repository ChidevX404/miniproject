'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, CircleDollarSign, Plus, Wallet, PiggyBank, Home, Settings, MinusCircle, PlusCircle, X } from 'lucide-react';
import Link from 'next/link';

// กำหนดหน้าตาข้อมูล
interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: string; 
  type: 'income' | 'expense';
  date: string;
  time: string;
}

export default function PocketPage() {
  // --- STATE ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // แก้ไข 1: เปลี่ยน 0n เป็น BigInt(0) เพื่อกัน Error ในบาง Environment
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [totalIncome, setTotalIncome] = useState<bigint>(BigInt(0));
  const [totalExpense, setTotalExpense] = useState<bigint>(BigInt(0));
  
  // State สำหรับ Modal (Pop-up)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [inputTitle, setInputTitle] = useState('');
  const [inputAmount, setInputAmount] = useState('');

  // --- LOAD DATA ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // ป้องกัน Error กรณีรันฝั่ง Server
    if (typeof window === 'undefined') return;

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user.id;
    const allData = JSON.parse(localStorage.getItem('my_transactions') || '[]');
    
    const myData = allData.filter((t: any) => t.userId === userId);
    const sortedData = myData.reverse(); 
    setTransactions(sortedData);

    let inc = BigInt(0);
    let exp = BigInt(0);

    sortedData.forEach((t: Transaction) => {
      // แปลง string เป็น BigInt
      const amountBigInt = BigInt(t.amount.toString().split('.')[0] || '0');
      
      if (t.type === 'income') inc = inc + amountBigInt; // เขียนแบบเต็ม inc = inc + ... เพื่อความชัวร์
      else exp = exp + amountBigInt;
    });

    setTotalIncome(inc);
    setTotalExpense(exp);
    setBalance(inc - exp);
  };

  // --- HANDLERS ---
  const openModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setInputTitle('');
    setInputAmount('');
    setIsModalOpen(true);
  };

  // ฟังก์ชันช่วยตอนพิมพ์ตัวเลข (ป้องกันการพิมพ์ตัวอักษร)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regex: ยอมให้พิมพ์แค่ตัวเลข 0-9 เท่านั้น
    if (/^\d*$/.test(value)) {
      setInputAmount(value);
    }
  };

  const handleSave = () => {
    if (!inputAmount || !inputTitle) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const now = new Date();

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      title: inputTitle,
      amount: inputAmount,
      type: modalType,
      date: now.toLocaleDateString('th-TH'),
      time: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    const allData = JSON.parse(localStorage.getItem('my_transactions') || '[]');
    const updatedData = [...allData, newTransaction];
    localStorage.setItem('my_transactions', JSON.stringify(updatedData));

    loadData();
    setIsModalOpen(false);
  };

  // ฟังก์ชันจัดรูปแบบตัวเลข
  const formatMoney = (amount: bigint | string) => {
    try {
        const val = typeof amount === 'string' ? BigInt(amount.split('.')[0]) : amount;
        return val.toLocaleString();
    } catch (e) {
        return amount.toString();
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24 relative">
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-6">
        <Link href="/home">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
        <h1 className="text-xl font-medium text-gray-800">กระเป๋าออมทรัพย์</h1>
        <Link href="/profile">
          <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <User className="w-6 h-6 text-gray-700" />
          </div>
        </Link>
      </div>

      <div className="px-6 space-y-6">
        
        {/* --- Balance Card --- */}
        <div className="bg-white/80 border border-cyan-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-50 p-4 rounded-full border border-gray-100">
                <CircleDollarSign className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">ยอดเงินในกระเป๋า</p>
                <p className="text-gray-300 text-xs">เงินประทังชีวิต</p>
              </div>
            </div>
            {/* แสดงยอดเงินจริง (BigInt) */}
            <div className={`text-2xl font-semibold overflow-hidden text-ellipsis ${balance < BigInt(0) ? 'text-red-500' : 'text-gray-600'}`}>
              {formatMoney(balance)}
            </div>
          </div>
        </div>

        {/* --- Income / Expense Summary --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">รวมรายรับ ( บาท )</p>
            <p className="text-lg font-semibold text-green-500 truncate">{formatMoney(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">รวมรายจ่าย ( บาท )</p>
            <p className="text-lg font-semibold text-red-400 truncate">{formatMoney(totalExpense)}</p>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => openModal('income')}
            className="bg-white rounded-2xl py-6 flex flex-col items-center justify-center shadow-sm hover:bg-green-50 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6 text-green-600 mb-1" />
            <span className="text-gray-800 font-medium text-sm">บันทึกรายรับ</span>
          </button>
          <button 
            onClick={() => openModal('expense')}
            className="bg-white rounded-2xl py-6 flex flex-col items-center justify-center shadow-sm hover:bg-red-50 transition-all active:scale-95"
          >
            <Wallet className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-gray-800 font-medium text-sm">บันทึกรายจ่าย</span>
          </button>
        </div>

        {/* --- Transactions List --- */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-medium text-gray-800">ประวัติล่าสุด</h2>
          </div>

          <div className="space-y-4 pb-4">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">ยังไม่มีรายการ</p>
            ) : (
              transactions.map((item) => (
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
                      <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                      <p className={`text-sm truncate ${item.type === 'income' ? 'text-green-500' : 'text-red-400'}`}>
                        {item.type === 'income' ? '+' : '-'} {formatMoney(item.amount)} บาท
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 self-start mt-1 flex-shrink-0 ml-2">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${modalType === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {modalType === 'income' ? 'บันทึกรายรับ 💰' : 'เพิ่มรายจ่าย 💸'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 ml-1">ชื่อรายการ</label>
                <input 
                  type="text" 
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder={modalType === 'income' ? "เช่น ค่าขนม ค่ารถ" : "เช่น ค่าข้าว ค่ารถ"}
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 ml-1">จำนวนเงิน</label>
                {/* แก้ไข 2: ใช้ type="text" เพื่อรองรับเลขยาวๆ และใช้ onChange คุมให้พิมพ์ได้แค่เลข */}
                <input 
                  type="text" 
                  inputMode="numeric" 
                  pattern="[0-9]*"
                  value={inputAmount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              <button 
                onClick={handleSave}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95 ${
                  modalType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                ยืนยัน
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] z-40">
        <button className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-900" />
        </button>
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