/**
 * Utility functions untuk mode buta warna
 * 
 * Gunakan fungsi ini untuk mendapatkan warna yang benar berdasarkan mode buta warna aktif.
 * Warna akan otomatis berubah saat mode buta warna diaktifkan.
 */

/**
 * Mapping warna: Original → Deuteranopia
 */
const COLOR_MAPPING: Record<string, { normal: string; deuteranopia: string }> = {
  // Backgrounds / Light Colors
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

  // Neutrals
  '#000000': { normal: '#000000', deuteranopia: '#000000' },
};

/**
 * Mengkonversi hex color ke CSS variable name
 * Contoh: #12250F -> var(--color-12250f)
 */
export function getColorVariable(hexColor: string): string {
  const normalized = hexColor.toUpperCase().replace('#', '');
  return `var(--color-${normalized.toLowerCase()})`;
}

/**
 * Mendapatkan warna yang benar berdasarkan mode buta warna aktif
 * Gunakan ini untuk inline styles jika tidak bisa menggunakan CSS variables
 * 
 * @param hexColor - Warna hex (contoh: '#12250F')
 * @param colorblindType - Tipe buta warna ('none' | 'deuteranopia')
 * @returns Warna yang sesuai dengan mode aktif
 */
export function getColorForMode(hexColor: string, colorblindType: 'none' | 'deuteranopia' = 'none'): string {
  const normalizedColor = hexColor.toUpperCase();
  const mapping = COLOR_MAPPING[normalizedColor];

  if (!mapping) {
    return hexColor; // Return warna asli jika tidak ada mapping
  }

  return colorblindType === 'deuteranopia' ? mapping.deuteranopia : mapping.normal;
}

/**
 * Helper untuk mendapatkan style object dengan warna yang benar
 * Gunakan ini untuk inline styles di React components
 * 
 * @param hexColor - Warna hex (contoh: '#12250F')
 * @returns Style object dengan backgroundColor menggunakan CSS variable
 */
export function getBackgroundColorStyle(hexColor: string): React.CSSProperties {
  return {
    backgroundColor: getColorVariable(hexColor),
  };
}

/**
 * Helper untuk mendapatkan style object dengan text color yang benar
 * 
 * @param hexColor - Warna hex (contoh: '#12250F')
 * @returns Style object dengan color menggunakan CSS variable
 */
export function getTextColorStyle(hexColor: string): React.CSSProperties {
  return {
    color: getColorVariable(hexColor),
  };
}

/**
 * Helper untuk mendapatkan style object dengan border color yang benar
 * 
 * @param hexColor - Warna hex (contoh: '#12250F')
 * @returns Style object dengan borderColor menggunakan CSS variable
 */
export function getBorderColorStyle(hexColor: string): React.CSSProperties {
  return {
    borderColor: getColorVariable(hexColor),
  };
}
