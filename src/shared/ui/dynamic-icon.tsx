
'use client';

import { icons } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: keyof typeof icons;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null; // Or return a fallback icon
  }

  return <LucideIcon {...props} />;
};
