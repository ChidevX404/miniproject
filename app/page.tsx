import { redirect } from 'next/navigation';

export default function Home() {
  // สั่งให้ดีดไปหน้า login ทันทีที่เข้าหน้าแรก
  redirect('/login');
}