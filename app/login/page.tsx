'use client'; // 1. จำเป็นต้องใส่บรรทัดนี้เมื่อมีการใช้ State หรือ Event

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import usersData from '../../data/users.json'; // 2. ดึงข้อมูล User (ตรวจสอบ path ให้ถูกต้อง)

export default function LoginPage() {
  const router = useRouter();

  // 3. สร้างตัวแปรเก็บค่าที่ user พิมพ์
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 4. ฟังก์ชันเมื่อกดปุ่ม Sign In
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    setError('');

    // --- ส่วนที่แก้ไขเพิ่มเติม ---
    
    // A. ดึงข้อมูล User ที่สมัครใหม่จาก LocalStorage (ถ้ามี)
    // ต้องทำใน useEffect หรือตรวจสอบ typeof window เพื่อป้องกัน error ตอน render ฝั่ง server
    // แต่ใน event handler (onClick/onSubmit) สามารถเรียกใช้ localStorage ได้เลย
    const localUsers = JSON.parse(localStorage.getItem('users_db') || '[]');

    // B. รวมข้อมูลจากไฟล์ JSON และ LocalStorage เข้าด้วยกัน
    const allUsers = [...usersData, ...localUsers];

    // C. ค้นหา User จากข้อมูลทั้งหมด
    const userFound = allUsers.find(
      (u) => u.username === username && u.password === password
    );

    // -------------------------

    if (userFound) {
      // ถ้าเจอ: บันทึกข้อมูลลงเครื่อง (จำลอง Session) และไปหน้า Home
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      router.push('/home');
    } else {
      // ถ้าไม่เจอ: แจ้งเตือน
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex items-center justify-center p-6">
      <div className="bg-white rounded-[4rem] shadow-sm w-full max-w-md p-10 flex flex-col items-center">
        
        {/* Logo */}
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

        {/* Form เริ่มต้นตรงนี้ */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-sm text-gray-500 mb-2 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // เก็บค่าที่พิมพ์
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // เก็บค่าที่พิมพ์
              required
            />
          </div>

          {/* แสดงข้อความ Error สีแดง ถ้า Login ไม่ผ่าน */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-400 focus:ring-cyan-400" />
              <span>Remember me</span>
            </label>
            <button type="button" className="hover:text-cyan-500 transition-colors">
              Forgot Password?
            </button>
          </div>

          <div className="pt-4">
            <button 
              type="submit" // เปลี่ยนเป็น type submit เพื่อให้กด Enter แล้ว Login ได้
              className="w-full bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-4 rounded-2xl shadow-md shadow-cyan-100 transition-all active:scale-[0.98] text-xl"
            >
              Sign In
            </button>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] text-gray-300">Don't Have Account?</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <Link href="/register" className="w-full block">
            <button type="button" className="w-full bg-white border border-gray-200 text-gray-400 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
              Create Account
            </button>
          </Link>
          
        </form>
      </div>
    </div>
  );
}