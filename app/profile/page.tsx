'use client';

import React from 'react';
import { ChevronLeft, User, Pencil, PiggyBank, Home, Settings } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  // ข้อมูลจำลองของผู้ใช้งาน
  const userData = {
    displayName: "banana001",
    username: "banana001za",
    email: "banana168@gmail.com",
    phone: "0911688880"
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col">
      
      {/* --- Header --- */}
      <div className="p-6">
        <Link href="/setting">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
      </div>

      {/* --- Profile Section --- */}
      <div className="flex flex-col items-center px-8 flex-grow">
        
        {/* รูปโปรไฟล์วงกลม */}
        <div className="bg-white p-6 rounded-full border-[6px] border-white shadow-sm mb-4">
          <User className="w-32 h-32 text-gray-800" />
        </div>

        {/* ชื่อแสดงผลและปุ่มแก้ไข */}
        <div className="flex items-center space-x-2 mb-12">
          <span className="text-gray-800 font-medium text-lg">{userData.displayName}</span>
          <button className="p-1">
            <Pencil className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* --- Info Fields --- */}
        <div className="w-full space-y-8">
          
          {/* Username */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2">
            <span className="text-gray-500 text-sm">Username:</span>
            <span className="text-gray-800 font-medium">{userData.username}</span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2">
            <span className="text-gray-500 text-sm">Email:</span>
            <span className="text-gray-800 font-medium">{userData.email}</span>
          </div>

          {/* Phone */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2">
            <span className="text-gray-500 text-sm">Phone:</span>
            <span className="text-gray-800 font-medium">{userData.phone}</span>
          </div>

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
        <Link href="/setting" className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
      </div>

    </div>
  );
}