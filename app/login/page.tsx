import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. เพิ่มบรรทัดนี้เข้ามา

export default function LoginPage() {
  return (
    // พื้นหลังสีฟ้าอ่อนครอบคลุมทั้งหน้าจอ
    <div className="min-h-screen bg-[#E0F7FF] flex items-center justify-center p-6">
      
      {/* การ์ดสีขาวขอบมน */}
      <div className="bg-white rounded-[4rem] shadow-sm w-full max-w-md p-10 flex flex-col items-center">
        
        {/* ส่วนแสดงโลโก้รูปหมู */}
        <div className="relative w-40 h-40 mb-2">
          <Image 
            src="/logo_pig.png" 
            alt="BSL Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-2xl font-medium text-gray-700 mb-8">Sign-In</h1>

        {/* ฟอร์มกรอกข้อมูล */}
        <div className="w-full space-y-5">
          <div>
            <label className="block text-sm text-gray-500 mb-2 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-400 focus:ring-cyan-400" />
              <span>Remember me</span>
            </label>
            <button type="button" className="hover:text-cyan-500 transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* ปุ่ม Sign In */}
          <div className="pt-4">
            <button className="w-full bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-4 rounded-2xl shadow-md shadow-cyan-100 transition-all active:scale-[0.98] text-xl">
              Sign In
            </button>
          </div>

          {/* ตัวแบ่งเส้นกลาง */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] text-gray-300">Don't Have Account?</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* 2. ปุ่ม Create Account (แก้ตรงนี้) */}
          {/* ใช้ Link คลุมปุ่มไว้ เพื่อให้กดแล้วไปหน้า /register */}
          <Link href="/register" className="w-full block">
            <button className="w-full bg-white border border-gray-200 text-gray-400 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
              Create Account
            </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
}