'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // สร้างตัวแปรเก็บค่า
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มสถานะการโหลด

  // ฟังก์ชันเมื่อกดปุ่ม Sign In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // เริ่มโหลด

    try {
      // 1. ส่งข้อมูลไปเช็คที่ Server (API)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // 2. ถ้าผ่าน: บันทึกข้อมูล User ที่ได้จาก Server ลง Session (localStorage)
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        router.push('/home');
      } else {
        // 3. ถ้าไม่ผ่าน: แสดง Error ที่ Server ส่งมา
        setError(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false); // จบการโหลด (ปลดล็อคปุ่ม)
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

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-sm text-gray-500 mb-2 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all disabled:opacity-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading} // ล็อคช่องพิมพ์ตอนโหลด
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // ล็อคช่องพิมพ์ตอนโหลด
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg animate-pulse">
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
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-md transition-all text-xl 
                ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#80DFFF] hover:bg-[#6ed4f7] shadow-cyan-100 active:scale-[0.98]'}`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
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