'use client';

import { ColorblindModeProvider } from '@/contexts/ColorblindModeContext';

export default function ColorblindModeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ColorblindModeProvider>{children}</ColorblindModeProvider>;
}



