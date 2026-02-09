'use client';

import React from 'react';
import { ChevronLeft, User, PiggyBank, Home, Settings } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col">
      
      {/* --- Header / Back Button --- */}
      <div className="p-6">
        <Link href="/setting">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-grow flex flex-col items-center px-8 pt-4 pb-24">
        
        {/* Profile Summary Section */}
        <div className="flex flex-col items-center mb-12 space-y-4">
          
          {/* 1. แก้ไขตรงนี้: ปรับรูปโปรไฟล์ให้ใหญ่ขึ้น (w-32 h-32 -> w-40 h-40 และ padding) */}
          <div className="bg-white p-6 rounded-full border-[6px] border-white shadow-sm mb-4">
             <User className="w-32 h-32 text-gray-800" strokeWidth={1.5} />
          </div>
          
          <span className="text-gray-800 font-medium text-lg">banana001</span>
        </div>

        {/* Section Title */}
        <h1 className="text-xl font-bold text-gray-800 self-start mb-8">เปลี่ยนรหัสผ่าน</h1>

        {/* --- Form Fields (Underlined Style) --- */}
        <div className="w-full space-y-6 mb-12">
          
          {/* รหัสผ่านปัจจุบัน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              placeholder="รหัสผ่านปัจจุบัน"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* รหัสผ่านใหม่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
            <input
              type="password"
              placeholder="รหัสผ่านใหม่"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* ยืนยันรหัสผ่านใหม่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              placeholder="รหัสผ่านใหม่"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-black px-1 py-2 text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

        </div>

        {/* ปุ่มยืนยัน */}
        <button className="w-1/2 bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-3 rounded-2xl shadow-sm transition-all active:scale-[0.98] text-lg">
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
        {/* หน้าปัจจุบันคือส่วนหนึ่งของ Setting จึงให้ไอคอนนี้เป็น Active (สีเข้ม) */}
        <Link href="/setting" className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-900" />
        </Link>
      </div>

    </div>
  );
}