import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ดึงข้อมูลทั้งหมด
export async function GET() {
  try {
    const { data: transactions, error } = await supabase
      .from('Transaction')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return NextResponse.json([]);
  }
}

// บันทึกข้อมูลใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // บันทึกลง Database
    const { data: newTransaction, error } = await supabase
      .from('Transaction')
      .insert([
        {
          title: body.title,
          amount: body.amount, 
          type: body.type,
          date: body.date,
          time: body.time,
          userId: body.userId, 
          category: body.category || "ทั่วไป", // ถ้าไม่ได้เลือกหมวดหมู่ ให้เป็น "ทั่วไป"
          note: body.note || null,             // โน้ตเพิ่มเติม (ถ้าไม่มีก็เป็น null)
          imageUrl: body.imageUrl || null,     // รูปภาพ (ถ้าไม่มีก็เป็น null)
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Saved!', transaction: newTransaction });
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}