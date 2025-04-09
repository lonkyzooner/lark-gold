import React from 'react';
import { TransitionGroup as _TransitionGroup, CSSTransition as _CSSTransition } from 'react-transition-group';
const TransitionGroup: any = _TransitionGroup;
const CSSTransition: any = _CSSTransition;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
  error?: string | null;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading, error }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900 relative">
      {error && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-10">
          {error}
        </div>
      )}
      <TransitionGroup as={'div' as any} className="space-y-2">
        {messages.map((msg, idx) => (
          <CSSTransition
            key={idx}
            timeout={300}
            classNames={{
              enter: 'opacity-0 translate-y-2',
              enterActive: 'opacity-100 translate-y-0 transition-all duration-300',
              exit: 'opacity-100',
              exitActive: 'opacity-0 transition-opacity duration-200',
            }}
          >
            <div
              className={`p-3 rounded-xl max-w-[80%] shadow ${
                msg.role === 'user'
                  ? 'ml-auto bg-blue-500 text-white'
                  : msg.role === 'assistant'
                  ? 'mr-auto bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
                  : 'mx-auto bg-yellow-200 text-black'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.timestamp && (
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </CSSTransition>
        ))}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </TransitionGroup>
    </div>
  );
};

export default ChatHistory;