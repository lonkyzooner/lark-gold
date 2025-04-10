import React, { useState, useEffect } from 'react';
import orchestrator from '../services/LarkOrchestrator';

const ConversationPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(orchestrator.getState().messages);
  const [suggestions, setSuggestions] = useState(orchestrator.getState().suggestions);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = orchestrator.getState();
      setMessages([...state.messages]);
      setSuggestions([...state.suggestions]);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    orchestrator.handleTextInput(input);
    setInput('');
  };

  const handleAccept = (suggestion: string) => {
    orchestrator.handleTextInput(suggestion);
    // Optionally clear suggestions after accepting
    orchestrator.clearSuggestions();
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-3 rounded-2xl max-w-[75%] shadow transition-all duration-200 ${
              msg.role === 'user'
                ? 'ml-auto bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                : msg.role === 'assistant'
                ? 'mr-auto bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-black dark:text-white'
                : 'mx-auto bg-yellow-200 text-black'
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
          </div>
        ))}
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
                <button
                  onClick={() => {
                    orchestrator.getState().suggestions = orchestrator.getState().suggestions.filter(s => s !== sugg);
                    setSuggestions([...orchestrator.getState().suggestions]);
                  }}
                  className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                  Dismiss
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
          className="flex-1 p-3 rounded-full border border-gray-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 shadow transition-all duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ConversationPanel;