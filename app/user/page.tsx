'use client';

import { useState, useEffect } from 'react';

// กำหนดโครงสร้างข้อมูลให้ตรงกับที่คุณดึงมาจาก users.json (สมมติว่ามี name กับ email)
interface User {
  id?: string | number;
  name?: string;
  email?: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก API (/api/user)
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">รายชื่อผู้ใช้งานระบบ</h1>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">กำลังโหลดข้อมูลผู้ใช้...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow border text-center">
          ยังไม่มีข้อมูลผู้ใช้งานในระบบ
        </p>
      ) : (
        <div className="grid gap-4">
          {users.map((user, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-sm border flex flex-col">
              <span className="font-semibold text-lg text-gray-800">
                {user.name || 'ไม่ระบุชื่อ'}
              </span>
              <span className="text-gray-600">
                {user.email || 'ไม่มีข้อมูลอีเมล'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}