import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// ชี้ไปที่ไฟล์ data/transactions.json
const dbPath = path.join(process.cwd(), 'data', 'transactions.json');

export async function GET() {
  try {
    // อ่านข้อมูลจากไฟล์
    const fileData = await fs.readFile(dbPath, 'utf-8');
    const data = JSON.parse(fileData);
    return NextResponse.json(data);
  } catch (error) {
    // ถ้ายังไม่มีไฟล์ หรือไฟล์ว่างเปล่า ให้คืนค่าว่าง []
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newTransaction = await request.json();

    // อ่านข้อมูลเก่า
    let currentData = [];
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      currentData = JSON.parse(fileData);
    } catch (error) {
      currentData = [];
    }

    // เพิ่มข้อมูลใหม่
    const updatedData = [...currentData, newTransaction];

    // บันทึกลงไฟล์
    await fs.writeFile(dbPath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ success: true, message: 'Saved!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}
