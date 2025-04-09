import React, { useState, useEffect, lazy, Suspense } from 'react';
import './styles/voice-assistant.css';
import './styles/fluid-theme.css';
import { LarkAgentProvider } from './contexts/LarkAgentContext';
import ConversationPanel from './components/ConversationPanel';
import VoiceModule from './components/VoiceModule';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import LarkLogo from './components/LarkLogo';
import { LiveKitVoiceProvider } from './contexts/LiveKitVoiceContext';
import { 
  ShieldIcon, BookTextIcon, MicIcon, BatteryMedium, Clock, MapPin, WifiIcon, 
  WrenchIcon, Settings as SettingsIcon, FileTextIcon 
} from 'lucide-react';

const MirandaWorkflow = lazy(() => import('./components/MirandaWorkflow'));
const RSCodes = lazy(() => import('./components/RSCodes').then(m => ({ default: m.RSCodes })));
const ReportAssistant = lazy(() => import('./components/ReportAssistant'));
const Tools = lazy(() => import('./components/Tools').then(m => ({ default: m.Tools })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));

function App() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [connected, setConnected] = useState(true);
  const [location, setLocation] = useState('Baton Rouge, LA');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <LiveKitVoiceProvider>
      <LarkAgentProvider>
        <div className="min-h-screen fluid-background text-foreground p-4 md:p-6 overflow-hidden antialiased selection:bg-primary/20 selection:text-primary relative">
          <div className="fluid-wave"></div>
          <div className="fluid-wave-gold"></div>
          <div className="max-w-6xl mx-auto relative">
            <header className="mb-8 relative fluid-card rounded-2xl p-4 border border-[rgba(255,255,255,0.5)] backdrop-blur-sm shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <LarkLogo width={45} height={45} className="mr-1" />
                  <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight leading-none flex items-center">
                      <span className="fluid-heading">LARK</span>
                      <span className="ml-2 text-xs font-medium fluid-badge px-2 py-1 rounded-full">1.0</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-light mt-1">
                      Law Enforcement Assistance and Response Kit
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0 w-full md:w-auto">
                  <div className="flex items-center px-4 py-2 rounded-full bg-card border border-border/10 shadow-sm group">
                    <MapPin className="w-4 h-4 text-black/70 group-hover:text-black" />
                    <span className="text-sm font-medium ml-2 group-hover:text-black">{location}</span>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-card border border-border/10 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium ml-1.5 font-mono">{formatTime(currentTime)}</span>
                    </div>
                    <span className="w-[1px] h-4 bg-border"></span>
                    <div className="flex items-center gap-1.5">
                      <BatteryMedium className={`w-4 h-4 ${batteryLevel < 20 ? 'text-destructive' : batteryLevel > 50 ? 'text-success' : 'text-warning'}`} />
                      <span className={`text-xs font-medium ml-0.5 ${batteryLevel < 20 ? 'text-destructive' : batteryLevel > 50 ? 'text-foreground' : 'text-warning'}`}>
                        {batteryLevel}%
                      </span>
                    </div>
                    {connected ? (
                      <div className="flex items-center gap-1">
                        <WifiIcon className="w-4 h-4 text-success" />
                        <span className="text-xs font-medium text-success">Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <WifiIcon className="w-4 h-4 text-destructive" />
                        <span className="text-xs font-medium text-destructive">Offline</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>
            <main className="relative mb-8 space-y-6 z-10">
              <Tabs defaultValue="assistant" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 fluid-glass rounded-2xl p-3 flex flex-wrap md:flex-nowrap justify-between border border-[rgba(255,255,255,0.4)] shadow-lg gap-2 backdrop-blur-sm sticky top-0 z-20 bg-white/20">
                  <TabsTrigger value="assistant" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800 data-[state=active]:text-white">Assistant</TabsTrigger>
                  <TabsTrigger value="voice" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800 data-[state=active]:text-white">Voice</TabsTrigger>
                  <TabsTrigger value="miranda" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800 data-[state=active]:text-white">Miranda</TabsTrigger>
                  <TabsTrigger value="statutes" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800 data-[state=active]:text-white">Statutes</TabsTrigger>
                  <TabsTrigger value="reports" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800 data-[state=active]:text-white">Reports</TabsTrigger>
                  <TabsTrigger value="tools" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800 data-[state=active]:text-white">Tools</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1 rounded-full py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800 data-[state=active]:text-white">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="assistant" className="p-4 space-y-4">
                  <ConversationPanel />
                  <VoiceModule />
                </TabsContent>
                <TabsContent value="miranda" className="p-4">
                  <Suspense fallback={<div>Loading Miranda Workflow...</div>}>
                    <MirandaWorkflow />
                  </Suspense>
                </TabsContent>
                <TabsContent value="statutes" className="p-4">
                  <Suspense fallback={<div>Loading Statutes...</div>}>
                    <RSCodes />
                  </Suspense>
                </TabsContent>
                <TabsContent value="reports" className="p-4">
                  <Suspense fallback={<div>Loading Report Assistant...</div>}>
                    <ReportAssistant />
                  </Suspense>
                </TabsContent>
                <TabsContent value="tools" className="p-4">
                  <Suspense fallback={<div>Loading Tools...</div>}>
                    <Tools />
                  </Suspense>
                </TabsContent>
                <TabsContent value="settings" className="p-4">
                  <Suspense fallback={<div>Loading Settings...</div>}>
                    <Settings />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </main>
            <footer className="mt-8 text-center text-xs text-muted-foreground pt-6 border-t border-border">
              <p className="flex items-center justify-center gap-1 font-medium">
                <span>© 2025 Zooner Enterprises</span>
                <span className="text-border/80">•</span>
                <span>All Rights Reserved</span>
              </p>
            </footer>
          </div>
        </div>
      </LarkAgentProvider>
    </LiveKitVoiceProvider>
  );
}

export default App;
