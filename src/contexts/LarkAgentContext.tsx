import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface LarkAgentContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  workflowState: string;
  suggestions: string[];
  addSuggestion: (suggestion: string) => void;
  sendText: (text: string) => Promise<void>;
  setError: (error: string | null) => void;
}

const LarkAgentContext = createContext<LarkAgentContextType | undefined>(undefined);

export const useLarkAgent = () => {
  const context = useContext(LarkAgentContext);
  if (!context) throw new Error('useLarkAgent must be used within LarkAgentProvider');
  return context;
};

export const LarkAgentProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflowState, setWorkflowState] = useState<string>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sendText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text.trim(), timestamp: Date.now() }]);
    setIsLoading(true);
    setError(null);
    try {
      // Call OpenRouter (QuasarAlpha) as default LLM
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'quasar-alpha',
          messages: [
            { role: 'system', content: 'You are LARK, an autonomous law enforcement assistant.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text.trim() }
          ]
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }]);
    } catch (e: any) {
      console.error('LarkAgent error:', e);
      setError(e.message || 'Failed to get response');
    }
    setIsLoading(false);
  }, [messages]);

  const addSuggestion = (suggestion: string) => {
    setSuggestions(prev => [...prev, suggestion]);
  };

  return (
    <LarkAgentContext.Provider value={{ messages, isLoading, error, workflowState, suggestions, addSuggestion, sendText, setError }}>
      {children}
    </LarkAgentContext.Provider>
  );
};