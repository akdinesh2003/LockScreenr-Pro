"use client";

import { createElement } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AppIconProps {
  icon: string;
  color?: string;
  className?: string;
}

export function AppIcon({ icon, color = 'bg-gray-500', className }: AppIconProps) {
  if (icon.startsWith('data:image')) {
    return (
      <Image
        src={icon}
        alt="Generated App Icon"
        width={24}
        height={24}
        className={cn('w-6 h-6 rounded-md', className)}
      />
    );
  }
  
  const LucideIcon = (Icons as any)[icon] || Icons.AppWindow;

  return (
    <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', color, className)}>
      <LucideIcon className="w-4 h-4 text-white" />
    </div>
  );
}
