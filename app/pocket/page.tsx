'use client';
 
import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Plus, Wallet, PiggyBank, Home, Settings, X, Image as ImageIcon, Tag, FileText, Shapes, History } from 'lucide-react';
import Link from 'next/link';
 
// อัปเดตหน้าตาข้อมูลให้รองรับของใหม่
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
 
export default function PocketPage() {
  // ⭐ State สำหรับเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง (แก้จอแดง Hydration Error)
  const [isMounted, setIsMounted] = useState(false);
 
  // --- STATE ---
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [totalIncome, setTotalIncome] = useState<bigint>(BigInt(0));
  const [totalExpense, setTotalExpense] = useState<bigint>(BigInt(0));
 
  // State สำหรับฟอร์มเพิ่มข้อมูล
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [inputTitle, setInputTitle] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputCategory, setInputCategory] = useState('ทั่วไป');
  const [inputNote, setInputNote] = useState('');
  const [inputImage, setInputImage] = useState<string | null>(null);
 
  // --- LOAD DATA ---
  useEffect(() => {
    // ⭐ สั่งให้ isMounted เป็น true เมื่อโหลดหน้าจอฝั่ง Client เสร็จ
    setIsMounted(true);
    loadData();
  }, []);
 
  const loadData = async () => {
    if (typeof window === 'undefined') return;
 
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = user.id;
 
      const res = await fetch('/api/transaction');
      const allData = await res.json();
     
      const myData = allData.filter((t: any) => t.userId === userId);
 
      let inc = BigInt(0);
      let exp = BigInt(0);
 
      myData.forEach((t: Transaction) => {
        const amountBigInt = BigInt(t.amount.toString().split('.')[0] || '0');
        if (t.type === 'income') inc = inc + amountBigInt;
        else exp = exp + amountBigInt;
      });
 
      setTotalIncome(inc);
      setTotalExpense(exp);
      setBalance(inc - exp);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };
 
  // --- HANDLERS ---
  const openModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setInputTitle('');
    setInputAmount('');
    setInputCategory(type === 'income' ? 'เงินเดือน' : 'อาหาร'); // ค่าเริ่มต้น
    setInputNote('');
    setInputImage(null);
    setIsModalOpen(true);
  };
 
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputAmount(value);
    }
  };
 
  // ฟังก์ชันแปลงรูปภาพเป็น Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
 
  const handleSave = async () => {
    if (!inputAmount || !inputTitle) return;
 
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const now = new Date();
 
    const newTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      title: inputTitle,
      amount: inputAmount,
      type: modalType,
      date: now.toLocaleDateString('th-TH'),
      time: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      category: inputCategory,
      note: inputNote,
      imageUrl: inputImage
    };
 
    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
 
      if (res.ok) {
        await loadData();
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        alert(`บันทึกข้อมูลไม่สำเร็จ: ${errorData.error || 'Server Error'}`);
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };
 
  const formatMoney = (amount: bigint | string) => {
    try {
        const val = typeof amount === 'string' ? BigInt(amount.split('.')[0]) : amount;
        return val.toLocaleString();
    } catch (e) {
        return amount.toString();
    }
  };
 
  // ⭐ ดักการแสดงผลตอนกำลังโหลด (โชว์ Loading หมุนๆ แบบเดียวกับหน้า Notification)
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
      <div className="relative flex items-center justify-center p-6 mt-4">
        <Link href="/home" className="absolute left-6">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">กระเป๋าออมทรัพย์</h1>
        <Link href="/profile" className="absolute right-6">
          <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </Link>
      </div>
 
      <div className="px-6 space-y-4">
       
        {/* --- Balance Card --- */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between border border-gray-50">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-50 p-3 rounded-full border border-gray-100 flex items-center justify-center w-14 h-14">
               {/* ไอคอนรูปดอลลาร์ตามแบบ */}
              <span className="text-2xl font-bold text-gray-500">$</span>
            </div>
            <div>
              <p className="text-gray-800 font-medium text-[15px]">ยอดเงินในกระเป๋า</p>
              <p className="text-gray-300 text-[11px] mt-0.5">เงินประทังชีวิต</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-700 truncate max-w-[120px] text-right">
            {formatMoney(balance)}
          </div>
        </div>
 
        {/* --- Income / Expense Summary --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-50">
            <p className="text-[11px] font-medium text-gray-400 mb-2">รวมรายรับ ( บาท )</p>
            <p className="text-xl font-bold text-green-500 truncate">{formatMoney(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-50">
            <p className="text-[11px] font-medium text-gray-400 mb-2">รวมรายจ่าย ( บาท )</p>
            <p className="text-xl font-bold text-red-500 truncate">{formatMoney(totalExpense)}</p>
          </div>
        </div>
 
        {/* --- Action Buttons (4 Menu Grid) --- */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* แถว 1 */}
          <button
            onClick={() => openModal('income')}
            className="bg-white rounded-[1.5rem] py-8 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:bg-green-50 transition-all active:scale-95"
          >
            <Plus className="w-7 h-7 text-green-500 mb-3" />
            <span className="text-gray-700 font-medium text-[13px]">บันทึกรายรับ</span>
          </button>
         
          <button
            onClick={() => openModal('expense')}
            className="bg-white rounded-[1.5rem] py-8 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:bg-red-50 transition-all active:scale-95"
          >
            <Wallet className="w-7 h-7 text-red-500 mb-3" />
            <span className="text-gray-700 font-medium text-[13px]">บันทึกรายจ่าย</span>
          </button>
 
          {/* แถว 2 */}
          <Link
            href="/category-summary"
            className="bg-white rounded-[1.5rem] py-8 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:bg-gray-50 transition-all active:scale-95"
          >
            <Shapes className="w-7 h-7 text-gray-800 mb-3" />
            <span className="text-gray-700 font-medium text-[13px]">สรุปหมวดหมู่</span>
          </Link>
         
          <Link
            href="/retrospective-summary"
            className="bg-white rounded-[1.5rem] py-8 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:bg-gray-50 transition-all active:scale-95"
          >
            <History className="w-7 h-7 text-gray-800 mb-3" />
            <span className="text-gray-700 font-medium text-[13px]">สรุปย้อนหลัง</span>
          </Link>
        </div>
 
      </div>
 
      {/* --- MODAL POPUP: บันทึกข้อมูล --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
           
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${modalType === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {modalType === 'income' ? 'บันทึกรายรับ 💰' : 'บันทึกรายจ่าย 💸'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
 
            <div className="space-y-4">
              {/* ชื่อรายการ */}
              <div>
                <label className="text-xs text-gray-500 ml-1">ชื่อรายการ</label>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder={modalType === 'income' ? "เช่น เงินเดือน ค่าขนม" : "เช่น ค่าข้าว ค่ารถ"}
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200 mt-1"
                />
              </div>
             
              {/* จำนวนเงิน */}
              <div>
                <label className="text-xs text-gray-500 ml-1">จำนวนเงิน (บาท)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputAmount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200 mt-1"
                />
              </div>
 
              {/* หมวดหมู่ (Dropdown) */}
              <div>
                <label className="text-xs text-gray-500 ml-1 flex items-center gap-1"><Tag className="w-3 h-3"/> หมวดหมู่</label>
                <select
                  value={inputCategory}
                  onChange={(e) => setInputCategory(e.target.value)}
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200 mt-1 appearance-none"
                >
                  {modalType === 'income' ? (
                    <>
                      <option value="เงินเดือน">เงินเดือน</option>
                      <option value="ค้าขาย">ค้าขาย</option>
                      <option value="เงินคืน">เงินคืน</option>
                      <option value="ทั่วไป">ทั่วไป</option>
                    </>
                  ) : (
                    <>
                      <option value="อาหาร">อาหาร / เครื่องดื่ม</option>
                      <option value="เดินทาง">เดินทาง</option>
                      <option value="ช้อปปิ้ง">ช้อปปิ้ง</option>
                      <option value="บิล/ค่าเช่า">บิล / ค่าเช่า</option>
                      <option value="ทั่วไป">ทั่วไป</option>
                    </>
                  )}
                </select>
              </div>
 
              {/* โน้ตเพิ่มเติม */}
              <div>
                <label className="text-xs text-gray-500 ml-1 flex items-center gap-1"><FileText className="w-3 h-3"/> โน้ตเพิ่มเติม</label>
                <textarea
                  value={inputNote}
                  onChange={(e) => setInputNote(e.target.value)}
                  placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                  rows={2}
                  className="w-full bg-gray-50 p-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200 mt-1 resize-none"
                />
              </div>
 
              {/* แนบรูปภาพ */}
              <div>
                <label className="text-xs text-gray-500 ml-1 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> แนบรูปสลิป / ใบเสร็จ</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-gray-50 p-2 rounded-xl text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 mt-1"
                />
                {inputImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-100">
                    <img src={inputImage} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
 
              <button
                onClick={handleSave}
                className={`w-full py-4 mt-2 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95 ${
                  modalType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                บันทึกข้อมูล
              </button>
            </div>
 
          </div>
        </div>
      )}
 
      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] z-40">
       
        {/* ใส่ p-2 ให้ปุ่ม Home และ Settings เพื่อให้ขนาดเท่ากับ PiggyBank */}
        <div className="hover:scale-110 transition-transform p-2 bg-white/50 rounded-full cursor-pointer flex items-center justify-center">
          <PiggyBank className="w-8 h-8 text-gray-900" />
        </div>
       
        <Link href="/home" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <Home className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/setting" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
      </div>
 
    </div>
  );
}
 
