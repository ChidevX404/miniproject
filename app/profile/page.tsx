'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, User, Pencil, PiggyBank, Home, Settings, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ⭐ State สำหรับการแก้ไขชื่อ
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const currentUserLocal = JSON.parse(storedUser);

    try {
      // ดึงข้อมูลล่าสุดจาก Database
      const res = await fetch('/api/users');
      const allUsers = await res.json();
      const foundUser = allUsers.find((u: any) => u.id === currentUserLocal.id);

      if (foundUser) {
        setUser(foundUser);
        setEditName(foundUser.name || foundUser.username);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      } else {
        setUser(currentUserLocal);
        setEditName(currentUserLocal.name || currentUserLocal.username);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(currentUserLocal);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ ฟังก์ชันบันทึกชื่อใหม่ลง Database Prisma
  const handleSaveName = async () => {
    if (!editName.trim() || editName === user.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: editName
        })
      });

      if (res.ok) {
        const updatedUserFromServer = await res.json();
        setUser(updatedUserFromServer);
        // อัปเดต localStorage เพื่อให้หน้า Home เปลี่ยนชื่อตามทันที
        localStorage.setItem('currentUser', JSON.stringify(updatedUserFromServer));
        setIsEditing(false);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'ไม่สามารถอัปเดตชื่อในฐานข้อมูลได้');
      }
    } catch (error) {
      console.error("Update error:", error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#E0F7FF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-700 font-medium animate-pulse">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F7FF] flex flex-col pb-24 relative overflow-x-hidden">
      
      {/* Header */}
      <div className="p-6">
        <button onClick={() => router.back()} className="hover:bg-white/50 p-2 rounded-full transition-colors">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-8 flex-grow">
        <div className="bg-white p-6 rounded-full border-[6px] border-white shadow-sm mb-4">
          <User className="w-32 h-32 text-gray-800" />
        </div>

        {/* ⭐ ชื่อแสดงผล / แก้ไขชื่อ */}
        <div className="mb-12 w-full flex justify-center h-10">
          {isEditing ? (
            <div className="flex items-center bg-white/60 backdrop-blur-md rounded-2xl px-4 py-1 shadow-sm border border-white">
              <input 
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-800 font-medium text-lg w-32"
                autoFocus
                disabled={isSaving}
              />
              <div className="flex items-center ml-2 border-l border-gray-300 pl-2 space-x-2">
                <button onClick={handleSaveName} disabled={isSaving}>
                  <Check className={`w-5 h-5 ${isSaving ? 'text-gray-400' : 'text-green-600'}`} />
                </button>
                <button onClick={() => { setIsEditing(false); setEditName(user.name); }} disabled={isSaving}>
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-medium text-lg">
                {user.name || user.username}
              </span>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-white/50 rounded-full transition-colors bg-white/30"
              >
                <Pencil className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}
        </div>

        {/* Info Fields */}
        <div className="w-full space-y-8 bg-white/40 p-6 rounded-3xl backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-end border-b border-gray-400/30 pb-2">
            <span className="text-gray-500 text-sm">Username:</span>
            <span className="text-gray-800 font-medium">{user.username}</span>
          </div>
          <div className="flex justify-between items-end border-b border-gray-400/30 pb-2">
            <span className="text-gray-500 text-sm">Email:</span>
            <span className="text-gray-800 font-medium">{user.email || "-"}</span>
          </div>
          <div className="flex justify-between items-end border-b border-gray-400/30 pb-2">
            <span className="text-gray-500 text-sm">Phone:</span>
            <span className="text-gray-800 font-medium">{user.phone || "-"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#B6E9FF] py-4 px-10 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] z-40">
        <Link href="/pocket" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <PiggyBank className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/home" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <Home className="w-8 h-8 text-gray-700" />
        </Link>
        <Link href="/setting" className="hover:scale-110 transition-transform p-2 flex items-center justify-center">
          <Settings className="w-8 h-8 text-gray-700" />
        </Link>
      </div>
    </div>
  );
}