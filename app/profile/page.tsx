'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, User, Pencil, PiggyBank, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. เรียกใช้ useRouter

export default function ProfilePage() {
  const router = useRouter();
  
  // 2. State สำหรับเก็บข้อมูล User
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // ดึงข้อมูลจาก LocalStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ถ้ายังโหลดข้อมูลไม่เสร็จ หรือไม่มีข้อมูล
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#E0F7FF]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col">
      
      {/* --- Header --- */}
      <div className="p-6">
        {/* 3. ปุ่มกลับแบบย้อนประวัติ (History Back) */}
        <button onClick={() => router.back()} className="focus:outline-none">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* --- Profile Section --- */}
      <div className="flex flex-col items-center px-8 flex-grow">
        
        {/* รูปโปรไฟล์วงกลม */}
        <div className="bg-white p-6 rounded-full border-[6px] border-white shadow-sm mb-4">
          <User className="w-32 h-32 text-gray-800" />
        </div>

        {/* ชื่อแสดงผล (ใช้ user.name) */}
        <div className="flex items-center space-x-2 mb-12">
          <span className="text-gray-800 font-medium text-lg">
            {user.name || "Unknown User"}
          </span>
          <button className="p-1">
            <Pencil className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* --- Info Fields --- */}
        <div className="w-full space-y-8">
          
          {/* Username */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2">
            <span className="text-gray-500 text-sm">Username:</span>
            <span className="text-gray-800 font-medium">{user.username}</span>
          </div>

          {/* Email (เช็คว่ามีไหม ถ้าไม่มีขีด -) */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2">
            <span className="text-gray-500 text-sm">Email:</span>
            <span className="text-gray-800 font-medium">{user.email || "-"}</span>
          </div>

          {/* Phone (เช็คว่ามีไหม ถ้าไม่มีขีด -) */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2">
            <span className="text-gray-500 text-sm">Phone:</span>
            <span className="text-gray-800 font-medium">{user.phone || "-"}</span>
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