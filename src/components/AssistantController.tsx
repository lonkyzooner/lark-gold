import React, { useState, useEffect, useCallback } from 'react';
import { orchestratorService } from '../services/OrchestratorService';
import VoiceInput from './VoiceInput.tsx';
import ChatHistory from './ChatHistory.tsx';
import ChatInput from './ChatInput.tsx';
import VoiceOutput from './VoiceOutput.tsx';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

const AssistantController: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const listener = (response: any) => {
      setIsLoading(false);
      if (response.error) {
        setError(response.error);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.content, timestamp: Date.now() }]);
        setError(null);
      }
    };
    orchestratorService.onResponse('default-user', listener);
    return () => {
      orchestratorService.offResponse('default-user', listener);
    };
  }, []);

  const handleSendText = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text.trim(), timestamp: Date.now() }]);
    try {
      setIsLoading(true);
      orchestratorService.receiveInput({ userId: 'default-user', type: 'text', content: text.trim() });
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to send message');
    }
  }, []);

  const handleSendVoice = useCallback((transcript: string) => {
    if (!transcript.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: transcript.trim(), timestamp: Date.now() }]);
    try {
      setIsLoading(true);
      orchestratorService.receiveInput({ userId: 'default-user', type: 'voice', content: transcript.trim() });
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to send voice input');
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ChatHistory messages={messages} isLoading={isLoading} error={error} />
      <VoiceOutput lastMessage={messages.filter(m => m.role === 'assistant').slice(-1)[0]} />
      <VoiceInput onTranscript={handleSendVoice} />
      <ChatInput onSend={handleSendText} error={error} />
    </div>
  );
};

export default AssistantController;