import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// ชี้ไปที่ไฟล์ users.json
const dbPath = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
  try {
    // อ่านไฟล์ JSON
    const fileData = await fs.readFile(dbPath, 'utf-8');
    const users = JSON.parse(fileData);
    
    // ส่งข้อมูลผู้ใช้ทั้งหมดกลับไป (ตัด password ออกเพื่อความปลอดภัย)
    const safeUsers = users.map((u: any) => {
        const { password, ...userWithoutPass } = u;
        return userWithoutPass;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
