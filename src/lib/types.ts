export type DeviceType = 'iphone' | 'pixel' | 'tablet' | 'watch';
export type OsType = 'ios' | 'android' | 'wearos';

export interface Notification {
  id: string;
  icon: string;
  iconColor: string;
  appName: string;
  title: string;
  message: string;
  time: string;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
}

export interface LockScreenConfig {
  device: DeviceType;
  os: OsType;
  background: string;
  backgroundType: 'image' | 'color';
  font: string;
  statusBar: {
    wifi: 'hidden' | 'full' | 'medium' | 'low';
    signal: 'hidden' | 'full' | 'medium' | 'low';
    battery: number;
  };
  notifications: Notification[];
  hotspots: Hotspot[];
  privacyBlur: boolean;
  passcode: {
    enabled: boolean;
    value: string;
  };
  heatmapOverlay: string | null;
}
