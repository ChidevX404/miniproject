'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, PiggyBank, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // --- LOAD USER ---
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login'); // ถ้าไม่มี user ให้ดีดไปหน้า login
    }
  }, [router]);

  // --- HANDLER: เปลี่ยนรหัสผ่าน ---
  const handleChangePassword = () => {
    setError(''); // ล้าง error เก่า

    // 1. เช็คว่ากรอกครบไหม
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    // 2. เช็ครหัสเดิม
    if (currentPassword !== user.password) {
      setError('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      return;
    }

    // 3. เช็ครหัสใหม่ว่าตรงกันไหม
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    // 4. บันทึกข้อมูล (จำลองการอัปเดต)
    const updatedUser = { ...user, password: newPassword };
    
    // อัปเดต currentUser (Session ปัจจุบัน)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // อัปเดตใน users list (ถ้ามี) เพื่อให้ล็อกอินครั้งหน้าได้จริง
    // (ส่วนนี้เป็น Option เสริม ถ้าคุณมี users list ใน localStorage)
    const allUsers = JSON.parse(localStorage.getItem('users_db') || '[]');
    const updatedAllUsers = allUsers.map((u: any) => 
        u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('users_db', JSON.stringify(updatedAllUsers));

    // แจ้งเตือนและกลับไปหน้า Setting
    alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!');
    router.push('/setting');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col">
      
      {/* --- Header / Back Button --- */}
      <div className="p-6">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-grow flex flex-col items-center px-8 pt-4 pb-24">
        
        {/* Profile Summary Section */}
        <div className="flex flex-col items-center mb-12 space-y-4">
          <div className="bg-white p-6 rounded-full border-[6px] border-white shadow-sm mb-4">
             <User className="w-32 h-32 text-gray-800" strokeWidth={1.5} />
          </div>
          <span className="text-gray-800 font-medium text-lg">
            {user.username || 'user'}
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
              /* แก้ไขจุดที่ผิด: ลบบรรทัดที่ซ้ำและใช้ setConfirmPassword ที่ถูกต้อง */
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

        </div>

        {/* Error Message Area */}
        {error && (
          <div className="w-full mb-6 p-3 bg-red-100 text-red-500 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* ปุ่มยืนยัน */}
        <button 
          onClick={handleChangePassword}
          className="w-1/2 bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-3 rounded-2xl shadow-sm transition-all active:scale-[0.98] text-lg"
        >
            ยืนยัน
        </button>

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
          <Settings className="w-8 h-8 text-gray-900" />
        </Link>
      </div>

    </div>
  );
}