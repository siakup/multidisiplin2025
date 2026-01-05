'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isRoleAllowed, isUsernameAllowed } from '@/lib/common/utils/identity';

export default function Navbar() {
  const pathname = usePathname();
  const [userUsername, setUserUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Ambil username dari localStorage
    const syncUserInfo = () => {
      const username = localStorage.getItem('userUsername');
      const role = localStorage.getItem('userRole');
      setUserUsername(username);
      setUserRole(role);
    };

    syncUserInfo();

    const handleStorageChange = () => {
      syncUserInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  const facilityRoles = ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'];
  const facilityUsernames = ['Facility management'];
  const studentRoles = ['student housing', 'student hausing', 'STUDENT_HOUSING', 'student_housing'];
  const studentUsernames = ['student housing', 'student hausing'];

  const canAccessElectricity =
    isRoleAllowed(userRole, facilityRoles) || isUsernameAllowed(userUsername, facilityUsernames);
  const canAccessStudentHousing =
    isRoleAllowed(userRole, studentRoles) || isUsernameAllowed(userUsername, studentUsernames);

  return (
    <nav className="bg-white w-full shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
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

          {/* Mobile toggle */}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#172813]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavItem href="/dashboard" active={pathname === '/dashboard'}>
              Dashboard
            </NavItem>

            {canAccessElectricity && (
              <NavItem
                href="/electricity-bills"
                active={pathname === '/electricity-bills' || pathname.startsWith('/electricity-bills/')}
              >
                Tagihan Listrik
              </NavItem>
            )}

            {canAccessStudentHousing && (
              <Link
                href="/student-housing"
                className={`flex items-center space-x-2 transition-colors duration-200 px-4 py-2 rounded-lg ${
                  pathname === '/student-housing' || pathname.startsWith('/student-housing/')
                    ? 'border-2 text-gray-800' 
                    : 'text-gray-700 border-2 border-transparent'
                }`}
                style={{
                  borderColor: (pathname === '/student-housing' || pathname.startsWith('/student-housing/')) ? '#172813' : 'transparent'
                }}
              >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M22 10v6M2 10l10-5 10 5-10 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 12v5c3 3 9 3 12 0v-5"
                    />
                  </svg>
                  <span className="font-medium">Asrama Beasiswa</span>
                </Link>
            )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

type NavItemProps = {
  href: string;
  active: boolean;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
};

function NavItem({ href, active, children, mobile, onClick }: NavItemProps) {
  const base =
    'flex items-center gap-2 transition-colors duration-200 px-4 py-2 rounded-lg border-2 border-transparent text-gray-700';
  const activeClass = active ? 'border-[#172813] text-gray-900' : 'hover:border-[#d1d5db] hover:text-gray-900';
  const mobileClass = mobile ? 'w-full justify-start' : '';

  return (
    <Link href={href} onClick={onClick} className={`${base} ${activeClass} ${mobileClass}`}>
      {children}
    </Link>
  );
}
