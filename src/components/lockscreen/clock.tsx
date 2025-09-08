"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { OsType } from '@/lib/types';

interface ClockProps {
    os: OsType;
    font: string;
}

export function Clock({ os, font }: ClockProps) {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) {
        return (
            <div className="text-center text-white/90">
                <p className="text-lg font-medium">Loading...</p>
                <h1 className="text-8xl font-bold" style={{ fontFamily: font }}>
                    --:--
                </h1>
            </div>
        );
    }

    const timeString = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    const androidDateString = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    if (os === 'android' || os === 'wearos') {
        return (
            <div className="text-center text-white/90">
                <h1 className="text-7xl font-bold leading-tight" style={{ fontFamily: font }}>
                    {timeString.split(':')[0]}
                    <br/>
                    {timeString.split(':')[1]}
                </h1>
                <p className="text-lg mt-2">{androidDateString}</p>
            </div>
        )
    }

    return (
        <div className="text-center text-white/90">
            <p className="text-lg font-medium">{dateString}</p>
            <h1 className="text-8xl font-bold" style={{ fontFamily: font }}>
                {timeString}
            </h1>
        </div>
    );
}
