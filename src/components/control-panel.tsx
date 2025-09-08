"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import {
  Smartphone, Paintbrush, Bell, TestTube, Share, Shield, Package, Trash2, Plus, Wand2, Loader2, Download, Upload, VenetianMask
} from 'lucide-react';
import type { LockScreenConfig, Notification, DeviceType, OsType } from '@/lib/types';
import { themedPacks } from '@/lib/themes';
import { generateCustomAppIcon } from '@/ai/flows/generate-custom-app-icons';
import { simulateHotspotMapping } from '@/ai/flows/simulate-hotspot-mapping.ts';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { AppIcon } from './app-icon';

interface ControlPanelProps {
  config: LockScreenConfig;
  setConfig: Dispatch<SetStateAction<LockScreenConfig>>;
}

export function ControlPanel({ config, setConfig }: ControlPanelProps) {
  const { toast } = useToast();
  const [newNotification, setNewNotification] = useState<Omit<Notification, 'id' | 'time'>>({ appName: '', title: '', message: '', icon: 'MessageSquare', iconColor: 'bg-blue-500' });
  const [iconDescription, setIconDescription] = useState('A minimal blue bird logo');
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);
  const [isSimulatingHeatmap, setIsSimulatingHeatmap] = useState(false);
  const [hotspotMode, setHotspotMode] = useState(false);

  const handleThemeChange = (themeName: string) => {
    const theme = themedPacks[themeName as keyof typeof themedPacks];
    if (theme) setConfig(theme);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig(prev => ({ ...prev, background: event.target?.result as string, backgroundType: 'image' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addNotification = () => {
    if (!newNotification.appName || !newNotification.message) {
      toast({ title: 'Error', description: 'App Name and Message are required.', variant: 'destructive' });
      return;
    }
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConfig(prev => ({ ...prev, notifications: [...prev.notifications, notification] }));
    setNewNotification({ appName: '', title: '', message: '', icon: 'MessageSquare', iconColor: 'bg-blue-500' });
  };
  
  const handleGenerateIcon = async () => {
    if (!iconDescription) return;
    setIsGeneratingIcon(true);
    try {
      const result = await generateCustomAppIcon({ description: iconDescription });
      setNewNotification(prev => ({ ...prev, icon: result.iconDataUri }));
      toast({ title: 'Success', description: 'New app icon generated!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not generate icon.', variant: 'destructive' });
    } finally {
      setIsGeneratingIcon(false);
    }
  };

  const handleSimulateHeatmap = async () => {
      if (config.backgroundType !== 'image') {
          toast({ title: 'Info', description: 'Heatmap simulation requires an image background.' });
          return;
      }
      setIsSimulatingHeatmap(true);
      setConfig(prev => ({ ...prev, heatmapOverlay: null }));
      try {
          const result = await simulateHotspotMapping({ photoDataUri: config.background });
          setConfig(prev => ({ ...prev, heatmapOverlay: result.heatmapDataUri }));
          toast({ title: 'Success', description: 'Heatmap generated.' });
      } catch (error) {
          console.error(error);
          toast({ title: 'Error', description: 'Failed to generate heatmap.', variant: 'destructive' });
      } finally {
          setIsSimulatingHeatmap(false);
      }
  };
  
  const exportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(config, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "lockscreenr-config.json";
    link.click();
    toast({title: "Exported JSON", description: "Configuration file has been downloaded."})
  }

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const newConfig = JSON.parse(event.target?.result as string);
          // Basic validation
          if (newConfig.device && newConfig.os && newConfig.notifications) {
            setConfig(newConfig);
            toast({title: "Imported JSON", description: "Configuration loaded successfully."})
          } else {
            throw new Error("Invalid config file.")
          }
        } catch (err) {
          toast({title: "Import Error", description: "Invalid or corrupted configuration file.", variant: "destructive"})
        }
      };
      reader.readAsText(file);
    }
  }


  return (
    <div className="flex h-full flex-col border-r bg-card">
      <header className="p-4 border-b shrink-0">
        <h1 className="text-xl font-bold font-headline text-primary-foreground bg-primary -m-4 p-4 rounded-t-lg">
          LockScreenr Pro
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Ultimate Lock Screen Simulator</p>
      </header>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['device', 'notifications']} className="w-full">

          <AccordionItem value="themes">
            <AccordionTrigger className="px-4"><Package className="mr-2" /> Themed Packs</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <Label>Quick Presets</Label>
              <Select onValueChange={handleThemeChange}>
                <SelectTrigger><SelectValue placeholder="Select a theme" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(themedPacks).map(themeName => (
                    <SelectItem key={themeName} value={themeName}>{themeName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="device">
            <AccordionTrigger className="px-4"><Smartphone className="mr-2" /> Device & Platform</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="device-type">Device Frame</Label>
                <Select value={config.device} onValueChange={v => setConfig(p => ({ ...p, device: v as DeviceType }))}>
                  <SelectTrigger id="device-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iphone">iPhone</SelectItem>
                    <SelectItem value="pixel">Pixel</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="watch">Smartwatch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="os-style">OS Style</Label>
                <Select value={config.os} onValueChange={v => setConfig(p => ({ ...p, os: v as OsType }))}>
                  <SelectTrigger id="os-style"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ios">iOS</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                    <SelectItem value="wearos">WearOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="background">
            <AccordionTrigger className="px-4"><Paintbrush className="mr-2" /> Customization</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <Label>Background</Label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
              <div className="flex items-center space-x-2">
                <Label htmlFor="bg-color">Or pick a color</Label>
                <Input id="bg-color" type="color" value={config.backgroundType === 'color' ? config.background : '#000000'} onChange={e => setConfig(p => ({...p, background: e.target.value, backgroundType: 'color'}))} className="p-1 h-8 w-16" />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notifications">
            <AccordionTrigger className="px-4"><Bell className="mr-2" /> Notifications</AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="space-y-2 mb-4">
                <Label>Current Notifications</Label>
                <ScrollArea className="h-40 border rounded-md p-2">
                  {config.notifications.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No notifications yet.</p>}
                  {config.notifications.map(n => (
                    <div key={n.id} className="flex items-center gap-2 p-1 rounded-md hover:bg-muted">
                      <AppIcon icon={n.icon} color={n.iconColor} />
                      <p className="flex-1 text-sm truncate">{n.appName}: {n.message}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setConfig(p => ({...p, notifications: p.notifications.filter(x => x.id !== n.id)}))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <Separator className="my-4" />
              <div className="space-y-4">
                <Label className="font-semibold">Add New Notification</Label>
                <div className='space-y-2'>
                  <Label htmlFor='app-name'>App Name</Label>
                  <Input id='app-name' placeholder="e.g., Messages" value={newNotification.appName} onChange={e => setNewNotification(p => ({ ...p, appName: e.target.value }))} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title (Optional)</Label>
                  <Input id='title' placeholder="e.g., Jane Doe" value={newNotification.title} onChange={e => setNewNotification(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea id='message' placeholder="What's on your mind?" value={newNotification.message} onChange={e => setNewNotification(p => ({ ...p, message: e.target.value }))} />
                </div>
                <div className='space-y-2'>
                  <Label>App Icon</Label>
                  <div className="flex items-center gap-2">
                    <Textarea placeholder="Describe an icon to generate..." value={iconDescription} onChange={e => setIconDescription(e.target.value)} rows={2} />
                    <Button onClick={handleGenerateIcon} disabled={isGeneratingIcon} size="icon">
                      {isGeneratingIcon ? <Loader2 className="animate-spin" /> : <Wand2 />}
                    </Button>
                  </div>
                </div>
                <Button onClick={addNotification} className="w-full"><Plus className="mr-2" /> Add Notification</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="testing">
            <AccordionTrigger className="px-4"><TestTube className="mr-2" /> UX Testing Tools</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hotspot-mode">Hotspot Mapping</Label>
                  <Switch id="hotspot-mode" checked={hotspotMode} onCheckedChange={setHotspotMode} />
                </div>
                {hotspotMode && <p className='text-xs text-muted-foreground'>Click on the preview to add hotspots.</p>}
                <Button variant="outline" className="w-full" onClick={() => setConfig(p => ({...p, hotspots: []}))}>Clear Hotspots</Button>
                <Separator />
                <Label>Simulated Eye-Tracking</Label>
                <Button variant="outline" className="w-full" onClick={handleSimulateHeatmap} disabled={isSimulatingHeatmap || config.backgroundType !== 'image'}>
                    {isSimulatingHeatmap ? <Loader2 className="animate-spin mr-2" /> : <VenetianMask className="mr-2" />}
                    Simulate Heatmap
                </Button>
                {config.heatmapOverlay && (
                    <Button variant="outline" className="w-full" onClick={() => setConfig(p => ({...p, heatmapOverlay: null}))}>
                        Clear Heatmap
                    </Button>
                )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger className="px-4"><Shield className="mr-2" /> Security Simulation</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="passcode-mode">Passcode Lock</Label>
                <Switch id="passcode-mode" checked={config.passcode.enabled} onCheckedChange={c => setConfig(p => ({...p, passcode: {...p.passcode, enabled: c}}))} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="privacy-blur">Privacy Blur</Label>
                <Switch id="privacy-blur" checked={config.privacyBlur} onCheckedChange={c => setConfig(p => ({...p, privacyBlur: c}))} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="export">
            <AccordionTrigger className="px-4"><Share className="mr-2" /> Presentation & Export</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <Button className="w-full" onClick={() => toast({ title: "Coming Soon!", description: "PNG export will be available in a future update." })}>Export as PNG</Button>
              <Button className="w-full" onClick={() => toast({ title: "Coming Soon!", description: "GIF export will be available in a future update." })}>Export as GIF</Button>
              <Separator />
              <Button className="w-full" variant="secondary" onClick={exportJson}><Download className="mr-2" /> Export JSON</Button>
              <div className="space-y-2">
                <Label htmlFor="import-json">Import JSON</Label>
                <Input id="import-json" type="file" accept=".json" onChange={importJson} className="file:text-primary file:font-semibold" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
