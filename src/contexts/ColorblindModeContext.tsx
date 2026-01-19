'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ColorblindType = 'none' | 'deuteranopia';

// Mapping warna: Original → Deuteranopia
const COLOR_MAPPING: Record<string, { normal: string; deuteranopia: string }> = {
  // Backgrounds / Light Colors (Map to Blue-ish or Red-ish based on tone, or keep neutral if needed. User said "semua yg berwarna")
  '#EFF6E9': { normal: '#EFF6E9', deuteranopia: '#EFF6E9' }, // Very light green -> Keep Neutral
  '#B9D6A1': { normal: '#B9D6A1', deuteranopia: '#005AB5' }, // Light Green -> Blue
  '#B8FF80': { normal: '#B8FF80', deuteranopia: '#005AB5' }, // Bright Green -> Blue

  // Greens -> Blue (#005AB5)
  '#345915': { normal: '#345915', deuteranopia: '#005AB5' },
  '#172813': { normal: '#172813', deuteranopia: '#172813' }, // Dark Green (Text) -> Keep Neutral
  '#12250F': { normal: '#12250F', deuteranopia: '#12250F' }, // Dark Green -> Keep Neutral
  '#1a2f15': { normal: '#1a2f15', deuteranopia: '#1a2f15' }, // Dark Green -> Keep Neutral
  '#5EA127': { normal: '#5EA127', deuteranopia: '#005AB5' },
  '#6CB33F': { normal: '#6CB33F', deuteranopia: '#005AB5' },
  '#93C06E': { normal: '#93C06E', deuteranopia: '#005AB5' },

  // Reds / Oranges -> Red (#DC3220)
  '#DA0000': { normal: '#DA0000', deuteranopia: '#DC3220' },
  '#FF9500': { normal: '#FF9500', deuteranopia: '#DC3220' },
  '#F59E0B': { normal: '#F59E0B', deuteranopia: '#DC3220' },
  '#EF4444': { normal: '#EF4444', deuteranopia: '#DC3220' },
  '#DC2626': { normal: '#DC2626', deuteranopia: '#DC3220' },

  // Neutrals (Exclude from tinting if pure black/white, or tint if desired. Keeping Black neutral.)
  '#000000': { normal: '#000000', deuteranopia: '#000000' },
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
