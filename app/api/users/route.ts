import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// [GET] สำหรับดึงข้อมูล User ทั้งหมด
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('User')
      .select('id, username, name, email, phone, role');

    if (error) throw error;
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// [PUT] ⭐ สำหรับอัปเดตชื่อ User
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name } = body;

    // ตรวจสอบความครบถ้วนของข้อมูล
    if (!id || !name || name.trim() === "") {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน หรือชื่อเป็นค่าว่าง' }, { status: 400 });
    }

    // อัปเดตข้อมูลในฐานข้อมูล Supabase 
    const { data: updatedUser, error } = await supabase
      .from('User')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Error code for "not found" single query
        return NextResponse.json({ error: 'ไม่พบผู้ใช้นี้ในระบบ' }, { status: 404 });
      }
      throw error;
    }

    // ส่งข้อมูลที่อัปเดตแล้วกลับไป (ยกเว้น password)
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);

  } catch (error: any) {
    console.error("Supabase Update Error:", error);
    return NextResponse.json({ error: 'บันทึกลง Database ไม่สำเร็จ' }, { status: 500 });
  }
}