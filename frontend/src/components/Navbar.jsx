// frontend/src/components/Navbar.jsx
'use client';

import React from 'react'; 
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

      <div className="flex-none">
      </div>
    </div>
  );
}