'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ColorblindType = 'none' | 'deuteranopia';

// Mapping warna: Original → Deuteranopia
const COLOR_MAPPING: Record<string, { normal: string; deuteranopia: string }> = {
  '#EFF6E9': { normal: '#EFF6E9', deuteranopia: '#F1F1EC' },
  '#B9D6A1': { normal: '#B9D6A1', deuteranopia: '#C3C1B0' },
  '#B8FF80': { normal: '#B8FF80', deuteranopia: '#D2CDA6' },
  '#5EA127': { normal: '#5EA127', deuteranopia: '#77724B' },
  '#345915': { normal: '#345915', deuteranopia: '#413F29' },
  '#172813': { normal: '#172813', deuteranopia: '#1D1C19' },
  '#000000': { normal: '#000000', deuteranopia: '#000000' },
  '#DA0000': { normal: '#DA0000', deuteranopia: '#889800' },
  '#FF9500': { normal: '#FF9500', deuteranopia: '#D7DF2C' },
  // Warna tambahan yang digunakan di aplikasi (mendekati warna di mapping)
  '#12250F': { normal: '#12250F', deuteranopia: '#1D1C19' }, // Mendekati #172813
  '#1a2f15': { normal: '#1a2f15', deuteranopia: '#1D1C19' }, // Hover dari #12250F
  '#6CB33F': { normal: '#6CB33F', deuteranopia: '#77724B' }, // Mendekati #5EA127
};

interface ColorblindModeContextType {
  colorblindType: ColorblindType;
  setColorblindType: (type: ColorblindType) => void;
  isEnabled: boolean;
  getColor: (color: string) => string;
}

const ColorblindModeContext = createContext<ColorblindModeContextType | undefined>(undefined);

export function ColorblindModeProvider({ children }: { children: ReactNode }) {
  const [colorblindType, setColorblindTypeState] = useState<ColorblindType>('none');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load dari localStorage
    const saved = localStorage.getItem('colorblindMode') as ColorblindType;
    if (saved && ['none', 'deuteranopia'].includes(saved)) {
      setColorblindTypeState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Simpan ke localStorage
    localStorage.setItem('colorblindMode', colorblindType);
    
    // Apply class ke html element
    const html = document.documentElement;
    html.classList.remove('colorblind-deuteranopia');
    
    if (colorblindType === 'deuteranopia') {
      html.classList.add('colorblind-deuteranopia');
    }
  }, [colorblindType, mounted]);

  const setColorblindType = (type: ColorblindType) => {
    setColorblindTypeState(type);
  };

  const getColor = (color: string): string => {
    const normalizedColor = color.toUpperCase();
    const mapping = COLOR_MAPPING[normalizedColor];
    
    if (!mapping) {
      return color; // Return warna asli jika tidak ada mapping
    }
    
    return colorblindType === 'deuteranopia' ? mapping.deuteranopia : mapping.normal;
  };

  const isEnabled = colorblindType !== 'none';

  return (
    <ColorblindModeContext.Provider value={{ colorblindType, setColorblindType, isEnabled, getColor }}>
      {children}
    </ColorblindModeContext.Provider>
  );
}

export function useColorblindMode() {
  const context = useContext(ColorblindModeContext);
  if (context === undefined) {
    throw new Error('useColorblindMode must be used within a ColorblindModeProvider');
  }
  return context;
}



