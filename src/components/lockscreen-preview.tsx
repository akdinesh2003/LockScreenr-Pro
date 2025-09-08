"use client";

import type { Dispatch, SetStateAction, MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import type { LockScreenConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { StatusBar } from './lockscreen/status-bar';
import { Clock } from './lockscreen/clock';
import { NotificationItem } from './lockscreen/notification-item';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const deviceDimensions = {
  iphone: { width: 390, height: 844, radius: '40px' },
  pixel: { width: 412, height: 915, radius: '28px' },
  tablet: { width: 768, height: 1024, radius: '18px' },
  watch: { width: 324, height: 394, radius: '40px' },
};

const osPaddings = {
    ios: 'p-0',
    android: 'p-0',
    wearos: 'p-0'
}

interface LockScreenPreviewProps {
  config: LockScreenConfig;
  setConfig: Dispatch<SetStateAction<LockScreenConfig>>;
}

function PasscodeScreen({ correctPin, onUnlock }: { correctPin: string, onUnlock: () => void }) {
    const [enteredPin, setEnteredPin] = useState('');
    const [isWrong, setIsWrong] = useState(false);

    useEffect(() => {
      if (enteredPin.length === 4) {
          if (enteredPin === correctPin) {
              onUnlock();
              setEnteredPin('');
          } else {
              setIsWrong(true);
              setTimeout(() => {
                  setIsWrong(false);
                  setEnteredPin('');
              }, 500);
          }
      }
    }, [enteredPin, correctPin, onUnlock]);

    const handleInput = (num: string) => {
        if (enteredPin.length < 4) {
            setEnteredPin(prev => prev + num);
        }
    };

    const handleDelete = () => setEnteredPin(prev => prev.slice(0, -1));
    
    return (
        <div className={cn("absolute inset-0 bg-black/50 backdrop-blur-xl z-30 flex flex-col items-center justify-center text-white", isWrong ? 'animate-shake' : '')}>
            <p className="mb-4">Enter Passcode</p>
            <div className="flex gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={cn("w-4 h-4 rounded-full border", enteredPin.length > i ? 'bg-white' : '')}></div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-8">
                {[..."123456789"].map(num => (
                    <Button key={num} variant="ghost" className="rounded-full h-16 w-16 text-2xl" onClick={() => handleInput(num)}>{num}</Button>
                ))}
                <div />
                <Button variant="ghost" className="rounded-full h-16 w-16 text-2xl" onClick={() => handleInput('0')}>0</Button>
                <Button variant="ghost" className="rounded-full h-16 w-16" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
    );
}

export function LockScreenPreview({ config, setConfig }: LockScreenPreviewProps) {
  const dimensions = deviceDimensions[config.device];
  const scale = config.device === 'watch' ? 0.8 : config.device === 'tablet' ? 0.6 : 0.7;

  const handleHotspotClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setConfig(prev => ({ ...prev, hotspots: [...prev.hotspots, { id: Date.now().toString(), x, y }] }));
  };

  return (
    <div
      className={cn(
          "relative shadow-2xl overflow-hidden bg-black border-black transition-all duration-300",
           config.device === 'watch' ? 'border-[10px]' : 'border-[12px]'
      )}
      style={{
        width: dimensions.width * scale,
        height: dimensions.height * scale,
        borderRadius: dimensions.radius
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        onClick={handleHotspotClick}
        style={{
          backgroundColor: config.backgroundType === 'color' ? config.background : 'transparent',
          backgroundImage: config.backgroundType === 'image' ? `url(${config.background})` : 'none',
        }}
      />

      {config.heatmapOverlay && (
        <Image
            src={config.heatmapOverlay}
            fill
            alt="Heatmap Overlay"
            className="absolute inset-0 z-20 opacity-70 pointer-events-none"
        />
      )}

      {config.passcode.enabled && (
          <PasscodeScreen correctPin={config.passcode.value} onUnlock={() => setConfig(p => ({...p, passcode: {...p.passcode, enabled: false}}))} />
      )}

      <div className={cn("relative z-10 flex flex-col h-full text-white", osPaddings[config.os])}>
        <StatusBar config={config} />
        
        <div className="flex-1" />

        <div className={cn("px-4 md:px-6", {'flex flex-col items-center justify-center -mt-20': config.os === 'android'})}>
            <Clock os={config.os} font={config.font} />
        </div>
        
        <div className="flex-1" />

        <div className={cn("space-y-2 mb-8 px-2 max-h-[50%] overflow-y-auto no-scrollbar", {'flex flex-col items-center': config.os === 'android'})}>
            {config.notifications.map(notif => (
                <NotificationItem key={notif.id} notification={notif} os={config.os} privacyBlur={config.privacyBlur} setConfig={setConfig} />
            ))}
        </div>

        {config.os !== 'android' && <div className="h-12 flex items-center justify-center">
            <Lock className="w-6 h-6" />
        </div>}
         {config.os === 'ios' && <div className="h-1 w-2/5 bg-white rounded-full self-center mb-2"></div>}
      </div>

       {config.hotspots.map(spot => (
            <div
                key={spot.id}
                className="absolute w-4 h-4 rounded-full bg-red-500/80 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            />
       ))}

    </div>
  );
}
