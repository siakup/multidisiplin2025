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
                width={200}
                height={60}
                className="h-14 w-auto"
              />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
            {/* Dashboard - selalu ditampilkan */}
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 transition-colors duration-200 px-4 py-2 rounded-lg ${
                pathname === '/dashboard' 
                  ? 'border-2 text-gray-800' 
                  : 'text-gray-700 border-2 border-transparent'
              }`}
              style={{
                borderColor: pathname === '/dashboard' ? '#172813' : 'transparent'
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
                    d="M3 3v18h18"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12v6M11 9v9M15 6v12M19 3v15"
                  />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>

            {/* Tagihan Listrik - hanya untuk Facility management */}
            {canAccessElectricity && (
              <Link
                href="/electricity-bills"
                className={`flex items-center space-x-2 transition-colors duration-200 px-4 py-2 rounded-lg ${
                  pathname === '/electricity-bills' || pathname.startsWith('/electricity-bills/')
                    ? 'border-2 text-gray-800' 
                    : 'text-gray-700 border-2 border-transparent'
                }`}
                style={{
                  borderColor: (pathname === '/electricity-bills' || pathname.startsWith('/electricity-bills/')) ? '#172813' : 'transparent'
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
                      d="M9 12l2 2 4-4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M3 9h9M3 13h6"
                    />
                  </svg>
                  <span className="font-medium">Tagihan Listrik</span>
                </Link>
            )}

            {/* Asrama Beasiswa - hanya untuk student housing */}
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
        </div>
      </nav>
  );
}
