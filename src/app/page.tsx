"use client";

import { useState, type Dispatch, type SetStateAction } from 'react';
import type { LockScreenConfig } from '@/lib/types';
import { themedPacks } from '@/lib/themes';
import { ControlPanel } from '@/components/control-panel';
import { LockScreenPreview } from '@/components/lockscreen-preview';

export default function Home() {
  const [config, setConfig] = useState<LockScreenConfig>(themedPacks["iOS Default"]);

  return (
    <div className="flex h-screen w-full bg-background font-body text-foreground overflow-hidden">
      <ControlPanel config={config} setConfig={setConfig} />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/30">
        <LockScreenPreview config={config} setConfig={setConfig} />
      </main>
    </div>
  );
}
