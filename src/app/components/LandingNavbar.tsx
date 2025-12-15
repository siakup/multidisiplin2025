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
              width={180}
              height={60}
              className="h-12 w-auto md:h-14"
              priority
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl bg-[#12250F] px-5 py-2 text-white hover:opacity-95 text-sm sm:text-base"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}


