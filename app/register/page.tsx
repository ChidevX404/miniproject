import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ใช้สำหรับเปลี่ยนหน้า

export default function RegisterPage() {
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

        <div className="w-full space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="example@mail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Register Button */}
          <div className="pt-4">
            <button className="w-full bg-[#80DFFF] hover:bg-[#6ed4f7] text-white font-bold py-4 rounded-2xl shadow-md shadow-cyan-100 transition-all active:scale-[0.98] text-xl">
              Sign Up
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-2">
            <span className="text-xs text-gray-400">Already have an account? </span>
            <Link href="/" className="text-xs text-cyan-500 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}