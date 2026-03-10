'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  // --- STATE เก็บค่าที่กรอก ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มสถานะการโหลด

  // --- HANDLER: สมัครสมาชิก ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. เช็คความถูกต้องเบื้องต้น
    if (!username || !password || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }

    setIsLoading(true); // เริ่มโหลด

    try {
      // 2. ส่งข้อมูลไปที่ API (Backend)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: Date.now().toString(),
          username,
          email, // ส่ง email ไปด้วย
          password,
          name: username, // ใช้ username เป็นชื่อเล่นไปก่อน
          phone: '-',
          role: 'user'
        }),
      });

      const data = await res.json();

      if (data.success) {
        // 3. ถ้าสำเร็จ: แจ้งเตือนและไปหน้า Login
        alert('สมัครสมาชิกสำเร็จ!');
        router.push('/login');
      } else {
        // 4. ถ้าไม่สำเร็จ (เช่น ชื่อซ้ำ): แสดง Error จาก Server
        setError(data.message || 'การสมัครสมาชิกบัญชีล้มเหลว');
      }

    } catch (err) {
      console.error(err);
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false); // จบการโหลด
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex items-center justify-center p-6">
      <div className="bg-white rounded-[4rem] shadow-sm w-full max-w-md p-10 flex flex-col items-center">
        
        {/* Logo */}
        <div className="relative w-32 h-32 mb-2">
          <Image 
            src="/logo_pig.png" 
            alt="BSL Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-2xl font-medium text-gray-700 mb-6">Sign-Up</h1>

        <form onSubmit={handleRegister} className="w-full space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all disabled:opacity-50"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all disabled:opacity-50"
              placeholder="example@mail.com"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all disabled:opacity-50"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all disabled:opacity-50"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg animate-pulse">
              {error}
            </div>
          )}

          {/* Register Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-md transition-all text-xl 
                ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#80DFFF] hover:bg-[#6ed4f7] shadow-cyan-100 active:scale-[0.98]'}`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-2">
            <span className="text-xs text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-xs text-cyan-500 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}