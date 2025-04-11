import React, { useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import VoiceContext from '../contexts/VoiceContext';
import LiveKitVoiceContext from '../contexts/LiveKitVoiceContext';
import { useSettings } from '../lib/settings-store';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { SendIcon, VolumeIcon, StopCircleIcon, Mic, MicOff, AlertCircle, Info } from 'lucide-react';
import { saveMessage, getMessages, queueOfflineMessage, getOfflineQueue, clearOfflineQueue } from '../lib/chat-storage';
import { queryOpenAI } from '../utils/openAIService';
import { huggingFaceService } from '../services/huggingface/HuggingFaceService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const MessageBubble = React.memo(({ message, onSpeakText }: { message: any, onSpeakText: (text: string) => void }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-5`} data-message-id={message.timestamp}>
    {message.role === 'assistant' && (
      <div className="flex-shrink-0 mr-3"><div className="w-10 h-10 rounded-full bg-[#003087] flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white/30">L</div></div>
    )}
    <div className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-md ${message.role === 'user' ? 'bg-gradient-to-br from-[#003087] to-[#004db3] text-white rounded-tr-none border border-blue-400/20' : 'bg-white/90 text-gray-800 rounded-tl-none border border-gray-200/50 backdrop-blur-sm'}`}>
      <div className="whitespace-pre-wrap text-[15px]">{message.content}</div>
      <div className={`mt-2 flex ${message.role === 'assistant' ? 'justify-between' : 'justify-end'}`}>
        <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        {message.role === 'assistant' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => onSpeakText(message.content)} className="text-xs flex items-center bg-white/80 hover:bg-white px-2 py-1 rounded-full shadow-sm transition-colors border border-gray-200/50">
                  <VolumeIcon className="h-3 w-3 mr-1 text-[#003087]" /><span className="text-gray-700">Listen</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top"><p>Read this message aloud</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
    {message.role === 'user' && (
      <div className="flex-shrink-0 ml-3"><div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 font-semibold shadow-sm">U</div></div>
    )}
  </div>
));

export default function LarkChat() {
  const voice = useContext(VoiceContext);
  const liveKitVoice = useContext(LiveKitVoiceContext);
  const { getOfficerName, getOfficerRank, getOfficerCodename } = useSettings();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsSpeaking(liveKitVoice.isSpeaking); }, [liveKitVoice.isSpeaking]);
  useEffect(() => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50); }, [messages]);
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await getMessages();
        if (saved.length === 0) {
          let welcome = "Hello! I'm LARK, your law enforcement assistant. How can I help you today?";
          const codename = getOfficerCodename(), name = getOfficerName(), rank = getOfficerRank();
          if (codename) welcome = `Hello ${codename}! I'm LARK, your law enforcement assistant. How can I help you today?`;
          else if (name) welcome = `Hello ${rank} ${name}! I'm LARK, your law enforcement assistant. How can I help you today?`;
          const welcomeMsg = { role: 'assistant' as "assistant", content: welcome, timestamp: Date.now() };
          await saveMessage(welcomeMsg); setMessages([welcomeMsg]);
        } else setMessages(saved);
        setIsInitialized(true);
      } catch { setMessages([]); setIsInitialized(true); }
    };
    load();
    const goOnline = () => { setIsOnline(true); processOfflineQueue(); };
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline); window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  const processOfflineQueue = useCallback(async () => {
    try {
      const queue = await getOfflineQueue();
      for (const item of queue) await processMessage(item.message);
      await clearOfflineQueue();
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (voice.transcript && voice.transcript.trim() !== '') {
      processMessage(voice.transcript);
      voice.stopListening();
    }
    const handleVoiceError = (event: any) => { setError(event.detail?.message || 'Voice error'); setTimeout(() => setError(null), 5000); };
    document.addEventListener('voice_error', handleVoiceError);
    return () => document.removeEventListener('voice_error', handleVoiceError);
  }, [voice.transcript]);

  const stopSpeaking = () => { if (isSpeaking) liveKitVoice.stopSpeaking(); setIsSpeaking(false); };
  const speakText = async (text: string) => {
    try {
      if (!text.trim()) return setError('Cannot speak empty text.');
      stopSpeaking(); setIsSpeaking(true);
      try { await liveKitVoice.speak(text, 'ash'); }
      catch { try { await liveKitVoice.speakWithOpenAIFallback(text, 'ash'); } catch { setError('Speech synthesis failed.'); setIsSpeaking(false); return; } }
      const interval = setInterval(() => { if (!liveKitVoice.isSpeaking) { setIsSpeaking(false); clearInterval(interval); } }, 500);
      setTimeout(() => { clearInterval(interval); setIsSpeaking(false); }, 30000);
    } catch { setIsSpeaking(false); setError('Failed to generate speech.'); setTimeout(() => setError(null), 5000); }
  };

  const processMessage = useCallback(async (userMessage: string, isOfflineQueued = false) => {
    try {
      setIsProcessing(true); setError(null);
      const userMsg = { role: 'user' as "user", content: userMessage, timestamp: Date.now() };
      await saveMessage(userMsg);
      huggingFaceService.detectEmotion(userMessage).catch(() => {});
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages); setInput('');
      if (!isOnline && !isOfflineQueued) {
        await queueOfflineMessage(userMessage);
        const offlineMsg = { role: 'assistant' as "assistant", content: 'I am currently offline. Your message has been queued and will be processed when the connection is restored.', timestamp: Date.now() };
        await saveMessage(offlineMsg); setMessages(prev => [...prev, offlineMsg]); setIsProcessing(false); return;
      }
      let response = '';
      try {
        const emotionResult = await huggingFaceService.detectEmotion(userMessage);
        if (['anger', 'fear', 'sadness', 'disgust'].includes(emotionResult.emotion) && emotionResult.score > 0.7) {
          setInfo(`I notice you might be feeling ${emotionResult.emotion}. I'm here to help.`); setTimeout(() => setInfo(null), 5000);
        }
      } catch {}
      if (!isOfflineQueued) {
        try {
          const voiceResult = await voice.processCommand(userMessage);
          if (voiceResult?.success) response = voiceResult.response;
        } catch {}
      }
      if (!response) {
        try {
          response = await Promise.race([queryOpenAI(userMessage), new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 30000))]) as string;
        } catch { response = "I'm having trouble connecting to my AI service right now. Please check your internet connection and try again later."; }
      }
      const assistantMsg = { role: 'assistant' as "assistant", content: response, timestamp: Date.now() };
      await saveMessage(assistantMsg); setMessages([...updatedMessages, assistantMsg]);
      try { if (response.trim()) await speakText(response); } catch {}
    } catch {
      const errorMsg = { role: 'assistant' as "assistant", content: 'I apologize, but I encountered an error processing your request. Please try again.', timestamp: Date.now() };
      await saveMessage(errorMsg); setMessages(prev => [...prev, errorMsg]); setError('Failed to process message. Please try again.');
    } finally { setIsProcessing(false); }
  }, [messages, isOnline, voice, speakText, saveMessage]);

  const handleSubmit = useCallback((e: React.FormEvent) => { e.preventDefault(); if (input.trim() && !isProcessing) processMessage(input.trim()); }, [input, isProcessing, processMessage]);

  const errorMessage = error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg flex items-center space-x-2"><AlertCircle className="h-5 w-5" /><span>{error}</span></div>;
  const infoMessage = info && <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-lg flex items-center space-x-2"><Info className="h-5 w-5" /><span>{info}</span></div>;

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4 space-y-4">
      {errorMessage}
      {infoMessage}
      <ScrollArea className="flex-1 p-4 rounded-lg border border-border/30 bg-white/90 shadow-md backdrop-blur-sm" style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
        <div className="space-y-6" style={{ minHeight: 'calc(100% - 50px)', paddingBottom: '20px' }}>
          {messages.map((message, i) => <MessageBubble key={`${message.timestamp}-${i}`} message={message} onSpeakText={speakText} />)}
          <div ref={messagesEndRef} style={{ height: '10px', padding: '12px 0', margin: '10px 0' }} />
        </div>
      </ScrollArea>
      {!isInitialized ? (
        <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003087]"></div></div>
      ) : (
        <div className="flex flex-col space-y-2">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." disabled={isProcessing} className="flex-1 text-black border-border/30 focus:border-[#003087] focus:ring-[#003087] rounded-full py-6 px-4 shadow-sm bg-white/90 backdrop-blur-sm" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isProcessing || !input.trim()} variant="default" className="bg-[#003087] hover:bg-[#004db3] transition-colors rounded-full p-6 h-auto w-auto shadow-md"><SendIcon className="h-5 w-5" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Send message</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isSpeaking ? (
                    <Button type="button" onClick={stopSpeaking} variant="destructive" className="transition-colors"><StopCircleIcon className="h-5 w-5" /></Button>
                  ) : (
                    <Button type="button" onClick={() => {
                      const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
                      if (lastAssistant) speakText(lastAssistant.content);
                    }} variant="outline" disabled={!messages.some(m => m.role === 'assistant')} className="border-gray-300 hover:bg-gray-100 transition-colors"><VolumeIcon className="h-5 w-5" /></Button>
                  )}
                </TooltipTrigger>
                <TooltipContent><p>{isSpeaking ? "Stop speaking" : "Speak last message"}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" className="border-gray-300 hover:bg-gray-100 transition-colors" onClick={async () => {
                    if (voice.isListening) voice.stopListening();
                    else {
                      if (voice.micPermission === 'denied' || voice.micPermission === 'prompt') {
                        const granted = await voice.requestMicrophonePermission();
                        if (!granted) { setError('Microphone access is required for voice commands.'); setInfo('You can still use LARK by typing your messages.'); setTimeout(() => { setError(null); setTimeout(() => setInfo(null), 3000); }, 3000); return; }
                      }
                      voice.startListening();
                    }
                  }} disabled={!isOnline}>
                    {voice.isListening ? <Mic className="h-5 w-5 text-green-500 animate-pulse" /> : voice.micPermission === 'denied' ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5 text-gray-500" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{voice.isListening ? "Stop listening" : voice.micPermission === 'denied' ? "Microphone access denied" : "Start voice input"}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
          {isProcessing && <div className="text-center text-sm text-gray-500 mt-2"><div className="inline-block animate-pulse">Processing your request...</div></div>}
        </div>
      )}
    </div>
  );
}
