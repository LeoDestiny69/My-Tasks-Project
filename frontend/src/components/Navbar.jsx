// frontend/src/components/Navbar.jsx
'use client';
// ไม่มี "use client"; ที่นี่อีกต่อไป เพราะไม่มีการใช้ Hooks หรือ Client-side APIs

import React from 'react'; // ไม่ต้อง import useState, useEffect แล้ว
import Link from 'next/link';

export default function Navbar() {
  const handleMenuClick = () => {
    console.log('Menu button clicked (Mobile)');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex-none lg:hidden">
        <button onClick={handleMenuClick} className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          MyTasks
        </Link>
      </div>

      {/* ส่วน Dropdown สำหรับเปลี่ยนธีมถูกลบออกไป */}
      <div className="flex-none">
        {/* อาจจะมีส่วนอื่น ๆ ที่คุณต้องการเก็บไว้ เช่น ปุ่ม Profile หรืออื่นๆ */}
        {/* ตัวอย่าง:
        <button className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        */}
      </div>
    </div>
  );
}