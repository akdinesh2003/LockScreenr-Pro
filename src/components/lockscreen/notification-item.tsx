"use client";

import type { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import type { Notification, OsType, LockScreenConfig } from '@/lib/types';
import { AppIcon } from '../app-icon';
import { Trash2 } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  os: OsType;
  privacyBlur: boolean;
  setConfig: Dispatch<SetStateAction<LockScreenConfig>>;
}

export function NotificationItem({ notification, os, privacyBlur, setConfig }: NotificationItemProps) {
  
  const dismiss = () => {
    setConfig(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== notification.id)
    }));
  };

  const commonClasses = "flex items-center gap-3 p-3 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-lg";

  if (os === 'android') {
    return (
        <div className={cn(commonClasses, "w-full max-w-sm relative group")}>
            <AppIcon icon={notification.icon} color={notification.iconColor} />
            <div className="flex-1 text-sm text-white/80 overflow-hidden">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-white/90">{notification.appName}</span>
                    <span className="text-xs">{notification.time}</span>
                </div>
                <p className={cn("truncate", { "blur-sm": privacyBlur })}>{notification.title && <span className="font-bold">{notification.title}: </span>}{notification.message}</p>
            </div>
            <button onClick={dismiss} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-opacity">
                <Trash2 size={16} />
            </button>
        </div>
    );
  }

  // iOS Style
  return (
    <div className={cn(commonClasses, "w-full max-w-sm relative group")}>
      <div className="flex-1 text-sm overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <AppIcon icon={notification.icon} color={notification.iconColor} className="w-5 h-5" />
          <span className="font-semibold uppercase text-xs text-white/70">{notification.appName}</span>
          <span className="ml-auto text-xs text-white/70">{notification.time}</span>
        </div>
        <p className="font-semibold text-white/90">{notification.title}</p>
        <p className={cn("text-white/80", { "blur-sm": privacyBlur })}>{notification.message}</p>
      </div>
       <button onClick={dismiss} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-opacity">
            <Trash2 size={20} />
       </button>
    </div>
  );
}
