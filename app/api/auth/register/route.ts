import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ดึงตัวเชื่อมต่อ Database ที่เราเพิ่งสร้างมาใช้

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email, name, phone } = body;

    // 1. เช็คว่า Username ซ้ำไหม
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' }, { status: 400 });
    }

    // 2. บันทึก User ใหม่ลง Supabase (ในตาราง User)
    // (หมายเหตุ: ในระบบจริงควรเข้ารหัส Password ก่อนบันทึก แต่เพื่อการเรียนรู้เราเก็บตรงๆ ไปก่อนครับ)
    const { error: insertError } = await supabase
      .from('User')
      .insert([
        {
          username,
          password,
          email: email || null,
          name: name || username, // ถ้าไม่ได้ส่งชื่อมา ให้ใช้ username แทน
          phone: phone || null,
          role: 'user'
        }
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, message: 'สมัครสมาชิกสำเร็จ!' });

  } catch (error) {
    console.error("❌ Database Error:", error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดที่ Server' }, { status: 500 });
  }
}