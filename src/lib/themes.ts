import type { LockScreenConfig } from './types';

const defaultNotifications = [
  { id: '1', icon: 'MessageSquare', iconColor: 'bg-green-500', appName: 'Messages', title: 'Jane Doe', message: 'Hey, are you free for dinner tonight?', time: '9:41 AM' },
  { id: '2', icon: 'Calendar', iconColor: 'bg-red-500', appName: 'Calendar', title: 'Team Sync', message: '10:00 AM - 11:00 AM', time: '9:30 AM' },
];

export const themedPacks: { [key: string]: LockScreenConfig } = {
  "iOS Default": {
    device: 'iphone',
    os: 'ios',
    background: 'https://picsum.photos/id/10/390/844',
    backgroundType: 'image',
    font: 'Inter, sans-serif',
    statusBar: {
      wifi: 'full',
      signal: 'full',
      battery: 85,
    },
    notifications: defaultNotifications,
    hotspots: [],
    privacyBlur: false,
    passcode: { enabled: false, value: '1234' },
    heatmapOverlay: null,
  },
  "Android Default": {
    device: 'pixel',
    os: 'android',
    background: 'https://picsum.photos/id/1015/412/915',
    backgroundType: 'image',
    font: 'Inter, sans-serif',
    statusBar: {
      wifi: 'full',
      signal: 'full',
      battery: 92,
    },
    notifications: [
       { id: '1', icon: 'Mail', iconColor: 'bg-blue-600', appName: 'Gmail', title: 'Project Update', message: 'See the latest changes to the project brief...', time: '9:41 AM' },
       { id: '2', icon: 'MessageCircle', iconColor: 'bg-cyan-500', appName: 'Chat', title: 'John Smith', message: 'Sounds good! Let\'s sync up tomorrow.', time: '9:25 AM' },
    ],
    hotspots: [],
    privacyBlur: false,
    passcode: { enabled: false, value: '1234' },
    heatmapOverlay: null,
  },
  "Minimalist Dark": {
    device: 'iphone',
    os: 'ios',
    background: '#1a1a1a',
    backgroundType: 'color',
    font: 'Inter, sans-serif',
    statusBar: {
      wifi: 'full',
      signal: 'medium',
      battery: 50,
    },
    notifications: [
        { id: '1', icon: 'Slack', iconColor: 'bg-purple-600', appName: 'Slack', title: '#general', message: 'Team lunch at 12:30 PM!', time: '11:05 AM' },
    ],
    hotspots: [],
    privacyBlur: true,
    passcode: { enabled: false, value: '1234' },
    heatmapOverlay: null,
  },
  "Nature Escape": {
      device: 'pixel',
      os: 'android',
      background: 'https://picsum.photos/id/1018/412/915',
      backgroundType: 'image',
      font: 'serif',
      statusBar: {
        wifi: 'full',
        signal: 'full',
        battery: 70,
      },
      notifications: [],
      hotspots: [],
      privacyBlur: false,
      passcode: { enabled: false, value: '1234' },
      heatmapOverlay: null,
  }
};
