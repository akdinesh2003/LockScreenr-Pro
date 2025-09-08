"use client";
import { Wifi, Signal, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';
import type { LockScreenConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBarProps {
    config: LockScreenConfig
}

function BatteryIcon({ level }: { level: number }) {
    if (level > 75) return <BatteryFull />;
    if (level > 40) return <BatteryMedium />;
    if (level > 10) return <BatteryLow />;
    return <BatteryWarning className="text-red-500" />;
}

export function StatusBar({ config }: StatusBarProps) {
    const { os, statusBar } = config;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (os === 'android') {
        return (
            <div className="flex justify-end items-center gap-2 text-sm font-medium px-4 pt-2 absolute top-0 left-0 right-0 z-20">
                {statusBar.signal !== 'hidden' && <Signal />}
                {statusBar.wifi !== 'hidden' && <Wifi />}
                <BatteryIcon level={statusBar.battery} />
                <span>{statusBar.battery}%</span>
            </div>
        )
    }

    if (os === 'wearos') {
        return null; // Watches often don't have a prominent status bar on the lock screen
    }

    // iOS style
    return (
        <div className="h-11 flex justify-between items-center text-sm font-semibold absolute top-0 left-0 right-0 z-20 px-6">
            <span>{time}</span>
            <div className="flex items-center gap-1.5">
                {statusBar.signal !== 'hidden' && <Signal />}
                {statusBar.wifi !== 'hidden' && <Wifi />}
                <BatteryIcon level={statusBar.battery} />
            </div>
        </div>
    )
}
