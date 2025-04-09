import React, { useState } from 'react';
import { useLarkAgent } from '../contexts/LarkAgentContext';

const ConversationPanel: React.FC = () => {
  const { messages, isLoading, error, suggestions, addSuggestion, sendText } = useLarkAgent();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendText(input);
    setInput('');
  };

  const handleAccept = async (suggestion: string) => {
    await sendText(suggestion);
    // Optionally remove suggestion after accepting
    // (not implemented here for simplicity)
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : msg.role === 'assistant'
                ? 'mr-auto bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
                : 'mx-auto bg-yellow-200 text-black'
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">LARK is thinking...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
        {suggestions.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Suggestions:</h3>
            {suggestions.map((sugg, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <span className="flex-1">{sugg}</span>
                <button
                  onClick={() => handleAccept(sugg)}
                  className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ConversationPanel;