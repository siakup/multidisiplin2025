'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LandingNavbar() {
  return (
    <nav className="bg-white w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Image
              src="/logo/logo-navbar.png"
              alt="Universitas Pertamina - Sustainability Center"
              width={200}
              height={60}
              className="h-14 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-gray-800 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12v6M11 9v9M15 6v12M19 3v15" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl bg-[#12250F] px-6 py-2.5 text-white hover:opacity-95"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}


