'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import LandingNavbar from './LandingNavbar';

export default function NavbarSwitcher() {
  const pathname = usePathname();

  const onLanding = pathname === '/';
  const onLogin = pathname === '/login';

  // Tidak ada navbar di halaman login
  if (onLogin) return null;

  // Selalu tampilkan LandingNavbar di /
  if (onLanding) {
    return <LandingNavbar />;
  }
  // Selain itu baru tampilkan Navbar utama (3 tombol)
  return <Navbar />;
}


