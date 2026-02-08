'use client';

import React from 'react';
import { ChevronLeft, PiggyBank, Home, Settings, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationPage() {
  // จำลองข้อมูลรายการแจ้งเตือน
  const notifications = [
    {
      date: 'วันนี้',
      items: [
        { type: 'expense', label: 'รายจ่าย ( บาท )', amount: '-50.00 บาท', time: '12:34' },
        { type: 'income', label: 'รายรับ ( บาท )', amount: '+100.00 บาท', time: '11:23' },
      ]
    },
    {
      date: '25 ม.ค 69',
      items: [
        { type: 'expense', label: 'รายจ่าย ( บาท )', amount: '-50.00 บาท', time: '20:31' },
        { type: 'income', label: 'รายรับ ( บาท )', amount: '+100.00 บาท', time: '19:23' },
      ]
    },
    {
      date: '24 ม.ค 69',
      items: [
        { type: 'expense', label: 'รายจ่าย ( บาท )', amount: '-50.00 บาท', time: '21:34' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24">
      
      {/* --- Header --- */}
      <div className="p-6">
        <Link href="/home">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </Link>
      </div>

      {/* --- Notification List --- */}
      <div className="px-6 space-y-8">
        {notifications.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-medium text-gray-800 mb-4 ml-2">
              {group.date}
            </h2>
            
            <div className="space-y-4">
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-2xl">
                      {item.type === 'expense' ? (
                        <MinusCircle className="w-6 h-6 text-gray-600" />
                      ) : (
                        <PlusCircle className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                      <p className={`text-sm font-semibold ${item.type === 'expense' ? 'text-red-400' : 'text-green-500'}`}>
                        {item.amount}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 self-start mt-1">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
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