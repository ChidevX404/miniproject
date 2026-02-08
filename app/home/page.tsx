'use client'; 

import React from 'react';
import { User, Bell, Home, Settings, PiggyBank, PlusCircle, MinusCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HomePage() {
  
  const data = {
    labels: ['คงเหลือ', 'ใช้ไป'],
    datasets: [
      {
        data: [100, 50],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '85%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-20">
      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between p-6">
        
        {/* 1. แก้ไขตรงนี้: เพิ่ม Link ไปหน้า Profile */}
        <Link href="/profile">
          <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <User className="w-6 h-6 text-gray-700" />
          </div>
        </Link>

        {/* ปุ่มกระดิ่งไปหน้า Notification */}
        <Link href="/notification" className="relative">
          <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#E0F7FF]"></span>
        </Link>
      </div>

      {/* --- Main Content --- */}
      <div className="px-6 flex-grow">
        {/* Balance Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-sm flex flex-col items-center justify-center h-80 relative">
          
          <div className="relative w-64 h-64">
            <Doughnut data={data} options={options} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-gray-700 font-medium text-lg">ยอดเงินคงเหลือ</p>
              <p className="text-gray-400 text-sm">50.00</p>
            </div>
          </div>

        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4 ml-2">ล่าสุด</h2>
          
          <div className="space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-2xl">
                  <MinusCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">รายจ่าย ( บาท )</p>
                  <p className="text-red-400 font-semibold">-50.00 บาท</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 self-start mt-1">12:34</span>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-2xl">
                  <PlusCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">รายรับ ( บาท )</p>
                  <p className="text-green-500 font-semibold">+100.00 บาท</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 self-start mt-1">11:23</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        
        {/* ปุ่มหมูออมสินไปหน้า Pocket */}
        <Link href="/pocket" className="hover:scale-110 transition-transform">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>

        {/* ปุ่ม Home (Current) */}
        <button className="hover:scale-110 transition-transform p-2">
          <Home className="w-8 h-8 text-gray-900" />
        </button>

        {/* ปุ่มเฟืองไปหน้า Setting */}
        <Link href="/setting" className="hover:scale-110 transition-transform">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
        
      </div>
    </div>
  );
}