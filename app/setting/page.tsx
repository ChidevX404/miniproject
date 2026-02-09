'use client';

import React from 'react';
import { ChevronLeft, User, Lock, LogOut, ChevronRight, PiggyBank, Home, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';

export default function SettingPage() {
  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col">
      
      {/* --- Header / Top Bar --- */}
      <div className="p-6">
        <Link href="/home">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
      </div>

      {/* --- Menu List Section --- */}
      <div className="flex-grow">
        <div className="bg-white mx-0 border-y border-gray-100">
          
          {/* ข้อมูลส่วนบุคคล (เชื่อมไปหน้า Profile) */}
          <Link href="/profile" className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-1">
                <User className="w-7 h-7 text-gray-800" />
              </div>
              <span className="text-gray-700 font-medium">ข้อมูลส่วนบุคคล</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </Link>

          {/* 1. แก้ไขตรงนี้: เปลี่ยน button เป็น Link ไปยังหน้า /change-password */}
          <Link href="/change-password" className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-1">
                <Lock className="w-7 h-7 text-gray-800" />
              </div>
              <span className="text-gray-700 font-medium">เปลี่ยนรหัสผ่าน</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </Link>

          {/* ออกจากระบบ */}
          <Link href="/login" className="w-full flex items-center p-5 hover:bg-red-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-1">
                <LogOut className="w-7 h-7 text-red-500" />
              </div>
              <span className="text-red-500 font-medium">ออกจากระบบ</span>
            </div>
          </Link>

        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <Link href="/pocket" className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/home" className="hover:scale-110 transition-transform">
          <Home className="w-8 h-8 text-gray-700" />
        </Link>
        <button className="hover:scale-110 transition-transform">
          <SettingsIcon className="w-8 h-8 text-gray-900" />
        </button>
      </div>

    </div>
  );
}