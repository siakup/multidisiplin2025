'use client';

import { useColorblindMode } from '@/contexts/ColorblindModeContext';

interface ColorblindModeToggleProps {
  fixed?: boolean;
}

export default function ColorblindModeToggle({ fixed = false }: ColorblindModeToggleProps) {
  const { colorblindType, setColorblindType, isEnabled } = useColorblindMode();

  const handleToggle = () => {
    // Toggle antara 'none' dan 'deuteranopia'
    setColorblindType(isEnabled ? 'none' : 'deuteranopia');
  };

  const containerClass = fixed
    ? "fixed bottom-4 right-4 z-50"
    : "relative";

  // Warna icon: normal = hitam, buta warna = abu-abu agak ke hijauan (#6B7280 atau #9CA3AF)
  const iconColor = isEnabled ? '#9CA3AF' : '#000000';

  return (
    <div className={containerClass}>
      <button
        onClick={handleToggle}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-12250f)] focus:border-transparent transition-colors shadow-sm"
        aria-label={isEnabled ? 'Nonaktifkan mode buta warna' : 'Aktifkan mode buta warna'}
        title={isEnabled ? 'Mode Deuteranopia Aktif - Klik untuk nonaktifkan' : 'Mode Normal - Klik untuk aktifkan mode buta warna'}
      >
        {/* Icon Kacamata */}
        <svg
          className="w-6 h-6 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: iconColor }}
        >
          {/* Frame kacamata kiri */}
          <circle cx="6" cy="12" r="4" />
          {/* Frame kacamata kanan */}
          <circle cx="18" cy="12" r="4" />
          {/* Bridge kacamata */}
          <line x1="10" y1="12" x2="14" y2="12" />
          {/* Temples (sisi kiri) */}
          <line x1="2" y1="12" x2="2" y2="11" />
          {/* Temples (sisi kanan) */}
          <line x1="22" y1="12" x2="22" y2="11" />
        </svg>

        {/* Badge indicator ketika mode aktif */}
        {isEnabled && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-12250f)] rounded-full border-2 border-white"></span>
        )}
      </button>
    </div>
  );
}

