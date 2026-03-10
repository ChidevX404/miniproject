import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ดึง Supabase มาใช้

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. ค้นหา User จาก Database
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;

    // 2. เช็คว่ามีผู้ใช้นี้ไหม และรหัสผ่านตรงไหม
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    // 3. ป้องกันการส่งรหัสผ่านกลับไปที่หน้าเว็บ (เพื่อความปลอดภัย)
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser, message: 'เข้าสู่ระบบสำเร็จ' });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}