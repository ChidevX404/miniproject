'use client';

import React from 'react';
import { ChevronLeft, User, CircleDollarSign, Plus, Wallet, PiggyBank, Home, Settings, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function PocketPage() {
  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24">
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-6">
        <Link href="/home">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
        <h1 className="text-xl font-medium text-gray-800">กระปุกออมทรัพย์</h1>
        <div className="bg-white p-2 rounded-full shadow-sm">
          <User className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <div className="px-6 space-y-6">
        
        {/* --- Balance Card --- */}
        <div className="bg-white/80 border border-cyan-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-50 p-4 rounded-full border border-gray-100">
                <CircleDollarSign className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">ยอดเงินในกระเป๋า</p>
                <p className="text-gray-300 text-xs">เงินประทังชีวิต</p>
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-600">50.00</div>
          </div>
        </div>

        {/* --- Income / Expense Summary --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">รวมรายรับ ( บาท )</p>
            <p className="text-lg font-semibold text-green-500">100.00</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">รวมรายจ่าย ( บาท )</p>
            <p className="text-lg font-semibold text-red-400">50.00</p>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white rounded-2xl py-6 flex flex-col items-center justify-center shadow-sm hover:bg-gray-50 transition-all">
            <Plus className="w-6 h-6 text-gray-800 mb-1" />
            <span className="text-gray-800 font-medium text-sm">รายรับ</span>
          </button>
          <button className="bg-white rounded-2xl py-6 flex flex-col items-center justify-center shadow-sm hover:bg-gray-50 transition-all">
            <Wallet className="w-6 h-6 text-gray-800 mb-1" />
            <span className="text-gray-800 font-medium text-sm">รายจ่าย</span>
          </button>
        </div>

        {/* --- Transactions List --- */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-medium text-gray-800">กระเป๋าเงิน</h2>
            <button className="bg-white px-4 py-1 rounded-lg text-xs text-gray-500 shadow-sm border border-gray-100">
              สร้าง
            </button>
          </div>

          <div className="space-y-4">
            {/* Expense Item */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-2xl">
                  <MinusCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">รายจ่าย ( บาท )</p>
                  <p className="text-red-400 text-sm">-50.00 บาท</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 self-start mt-1">12:34</span>
            </div>

            {/* Income Item */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-2xl">
                  <PlusCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">รายรับ ( บาท )</p>
                  <p className="text-green-500 text-sm">+100.00 บาท</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 self-start mt-1">11:23</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <button className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-900" />
        </button>
        <Link href="/home" className="hover:scale-110 transition-transform">
          <Home className="w-8 h-8 text-gray-700" />
        </Link>
        <button className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-700" />
        </button>
      </div>

    </div>
  );
}