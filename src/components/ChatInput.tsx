import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  error?: string | null;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, error }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-2 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      <input
        className="flex-1 p-2 rounded-l border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
      >
        Send
      </button>
      {error && <div className="text-red-500 text-xs ml-2">{error}</div>}
    </form>
  );
};

export default ChatInput;