'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, PiggyBank, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  
  // ⭐ State สำหรับเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง (แก้จอแดง Hydration Error)
  const [isMounted, setIsMounted] = useState(false);

  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // --- LOAD USER ---
  useEffect(() => {
    // ⭐ สั่งให้ isMounted เป็น true ทันทีที่โหลดหน้าจอฝั่ง Client เสร็จ
    setIsMounted(true);
    
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      router.push('/login');
    }
  }, [router]);

  // --- HANDLER: เปลี่ยนรหัสผ่าน ---
  const handleChangePassword = () => {
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (currentPassword !== user.password) {
      setError('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const allUsers = JSON.parse(localStorage.getItem('users_db') || '[]');
    const updatedAllUsers = allUsers.map((u: any) => 
        u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('users_db', JSON.stringify(updatedAllUsers));

    alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!');
    router.push('/setting');
  };

  // ⭐ แสดงหน้าต่าง Loading วงกลมหมุนๆ ระหว่างโหลด หรือยังไม่ Mounted
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#E0F7FF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-700 font-medium animate-pulse">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24 relative overflow-x-hidden">
      
      {/* --- Header / Back Button --- */}
      <div className="p-6">
        <button onClick={() => router.back()} className="hover:bg-white/50 p-2 rounded-full transition-colors">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-grow flex flex-col items-center px-8 pt-4">
        
        {/* Profile Summary Section */}
        <div className="flex flex-col items-center mb-12 space-y-4">
          <div className="bg-white p-6 rounded-full border-[6px] border-white shadow-sm mb-4">
             <User className="w-32 h-32 text-gray-800" strokeWidth={1.5} />
          </div>
          <span className="text-gray-800 font-medium text-lg">
            {user?.username || 'user'}
          </span>
        </div>

        {/* Section Title */}
        <h1 className="text-xl font-bold text-gray-800 self-start mb-8">เปลี่ยนรหัสผ่าน</h1>

        {/* --- Form Fields --- */}
        <div className="w-full space-y-6 mb-8">
          
          {/* รหัสผ่านปัจจุบัน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านเดิม"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* รหัสผ่านใหม่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="ตั้งรหัสผ่านใหม่"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* ยืนยันรหัสผ่านใหม่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

        </div>

        {/* Error Message Area */}
        {error && (
          <div className="w-full mb-6 p-3 bg-red-100 text-red-500 text-sm rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        {/* ปุ่มยืนยัน */}
        <button 
          onClick={handleChangePassword}
          className="w-1/2 bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-3 rounded-2xl shadow-sm transition-all active:scale-[0.98] text-lg mb-12"
        >
            ยืนยัน
        </button>

      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] z-40">
        
        {/* ปรับเพิ่ม p-2 ให้ทุกปุ่ม เพื่อให้ขนาดเท่ากันเป๊ะ */}
        <Link href="/pocket" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>
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