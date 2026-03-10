'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, User, Lock, LogOut, ChevronRight, PiggyBank, Home, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingPage() {
  const router = useRouter();

  // ⭐ State สำหรับเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง (แก้จอแดง Hydration Error)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // สั่งให้ isMounted เป็น true ทันทีที่โหลดหน้าจอฝั่ง Client เสร็จ
    setIsMounted(true);
  }, []);

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = () => {
    // ล้างข้อมูล User ที่ล็อกอินอยู่ออก
    localStorage.removeItem('currentUser');
    
    // (Optional) ถ้าอยากล้างข้อมูลอื่นด้วย เช่น ประวัติธุรกรรมที่ cache ไว้ ก็ลบได้
    // localStorage.removeItem('my_transactions'); 

    // ดีดกลับไปหน้า Login
    router.push('/login');
  };

  // ⭐ แสดงหน้าต่าง Loading วงกลมหมุนๆ ระหว่างโหลด
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
      
      {/* --- Header / Top Bar --- */}
      <div className="p-6">
        <Link href="/home">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
      </div>

      {/* --- Menu List Section --- */}
      <div className="flex-grow">
        <div className="bg-white mx-0 border-y border-gray-100">
          
          {/* ข้อมูลส่วนบุคคล */}
          <Link href="/profile" className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-1">
                <User className="w-7 h-7 text-gray-800" />
              </div>
              <span className="text-gray-700 font-medium">ข้อมูลส่วนบุคคล</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </Link>

          {/* เปลี่ยนรหัสผ่าน */}
          <Link href="/change-password" className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-1">
                <Lock className="w-7 h-7 text-gray-800" />
              </div>
              <span className="text-gray-700 font-medium">เปลี่ยนรหัสผ่าน</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </Link>

          {/* ปุ่มออกจากระบบ */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-5 hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-1">
                <LogOut className="w-7 h-7 text-red-500" />
              </div>
              <span className="text-red-500 font-medium">ออกจากระบบ</span>
            </div>
          </button>

        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] z-40">
        
        {/* ⭐ ปรับเพิ่ม p-2 ให้ทุกปุ่ม เพื่อให้ขนาดเท่ากัน */}
        <Link href="/pocket" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/home" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <Home className="w-8 h-8 text-gray-700" />
        </Link>
        
        {/* ใส่ Active พื้นหลังวงกลมที่ Settings */}
        <div className="hover:scale-110 transition-transform p-2 bg-white/50 rounded-full cursor-pointer flex items-center justify-center">
          <SettingsIcon className="w-8 h-8 text-gray-900" />
        </div>
      </div>

    </div>
  );
}