import React, { useState, useEffect, lazy, Suspense } from 'react';
import './styles/voice-assistant.css';
import './styles/fluid-theme.css';
import { LarkAgentProvider } from './contexts/LarkAgentContext';
import LarkMainLayout from './components/LarkMainLayout';
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
        <LarkMainLayout />
      </LarkAgentProvider>
    </LiveKitVoiceProvider>
  );
}

export default App;
