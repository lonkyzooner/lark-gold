import React, { useEffect, useState } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface VoiceOutputProps {
  lastMessage?: Message;
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({ lastMessage }) => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!lastMessage || lastMessage.role !== 'assistant') return;
    const utterance = new SpeechSynthesisUtterance(lastMessage.content);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  }, [lastMessage]);

  return (
    <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
      {speaking ? 'Speaking...' : 'Ready'}
    </div>
  );
};

export default VoiceOutput;