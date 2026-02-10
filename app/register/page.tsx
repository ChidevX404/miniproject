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

  // --- HANDLER: สมัครสมาชิก ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. เช็คความถูกต้องเบื้องต้น
    if (!username || !email || !password || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }

    // 2. เตรียมข้อมูล User ใหม่
    const newUser = {
      id: Date.now().toString(), // สร้าง ID มั่วๆ จากเวลาปัจจุบัน
      username,
      email,
      password,
      name: username, // ใช้ username เป็นชื่อเล่นไปก่อน
      phone: '-',     // ใส่ค่าว่างไว้ก่อน
      role: 'user'
    };

    // 3. ดึงข้อมูล User เก่ามาเช็ค (ถ้ามี)
    // หมายเหตุ: เราใช้ users_db ใน localStorage เป็นฐานข้อมูลจำลอง
    const existingUsers = JSON.parse(localStorage.getItem('users_db') || '[]');

    // เช็คว่า username ซ้ำไหม
    const isDuplicate = existingUsers.some((u: any) => u.username === username);
    if (isDuplicate) {
      setError('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
      return;
    }

    // 4. บันทึกข้อมูลลง LocalStorage
    // รวม User เก่า + User ใหม่
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users_db', JSON.stringify(updatedUsers));

    // *แถม* บันทึก users.json (ที่เป็นไฟล์ตั้งต้น) ลงไปด้วยเผื่อกรณี Login ครั้งแรก
    // (เทคนิคนี้ใช้เพื่อให้ระบบ Login ที่เราเขียนไว้ก่อนหน้า มองเห็น User ใหม่ด้วย)
    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]'); 
    localStorage.setItem('mock_users', JSON.stringify([...mockUsers, newUser]));

    // 5. แจ้งเตือนและไปหน้า Login
    alert('สมัครสมาชิกสำเร็จ!');
    router.push('/login'); // หรือ '/' ถ้าหน้า Login ของคุณอยู่ที่ root
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
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="example@mail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Register Button */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-4 rounded-2xl shadow-md shadow-cyan-100 transition-all active:scale-[0.98] text-xl"
            >
              Sign Up
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