import React, { useState, useRef, useEffect } from "react";
import { MicIcon, SendIcon, UserIcon, BotIcon } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AssistantPanel() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; timestamp: Date }[]
  >([
    // Example starter message
    // { role: "assistant", content: "How can I assist you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate assistant reply (replace with real backend integration)
  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    setMessages((msgs) => [
      ...msgs,
      { role: "user", content: input, timestamp: now }
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content: "Sorry, I encountered an error generating a response.",
          timestamp: new Date()
        }
      ]);
    }, 800);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="flex flex-col h-[500px] bg-[#181e2a] rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a3142] bg-[#23293a]">
        <div className="text-white text-2xl font-bold tracking-tight">LARK Assistant</div>
        <div className="flex items-center gap-4">
          <span className="text-[#bfc8e6] text-base font-medium">Secure Chat</span>
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-[#bfc8e6] opacity-60">No messages yet.</div>
        )}
        {messages.map((msg, idx) =>
          msg.role === "user" ? (
            <div key={idx} className="flex justify-end">
              <div className="flex flex-col items-end">
                <div className="bg-[#25407a] text-white rounded-2xl px-5 py-3 shadow-lg flex flex-col items-end w-fit min-w-[120px] max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <UserIcon className="h-4 w-4 text-white/80" />
                    <span className="font-semibold text-sm">You</span>
                  </div>
                  <div className="text-base font-medium">{msg.content}</div>
                  <div className="text-xs text-blue-100/70 mt-2">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div key={idx} className="flex justify-start">
              <div className="flex flex-col items-start">
                <div className="bg-[#e9ecf3] text-[#23293a] rounded-2xl px-5 py-3 shadow-lg flex flex-col w-fit min-w-[180px] max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <BotIcon className="h-4 w-4 text-[#23293a]/80" />
                    <span className="font-bold text-sm">LARK</span>
                  </div>
                  <div className="text-base font-medium">{msg.content}</div>
                  <div className="text-xs text-[#7a8199] mt-2">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      {/* Input Bar */}
      <div className="px-6 py-5 bg-[#23293a] border-t border-[#2a3142]">
        <form
          className="flex items-center gap-3"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            ref={inputRef}
            className="flex-1 rounded-full bg-[#23293a] border border-[#2a3142] px-6 py-4 text-lg text-white placeholder-[#bfc8e6] focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message or use the mic"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            type="submit"
            className="bg-[#25407a] hover:bg-[#3458a1] text-white rounded-full p-4 transition"
            aria-label="Send"
          >
            <SendIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`rounded-full p-4 transition ${
              listening ? "bg-[#25407a] text-white" : "bg-[#23293a] text-[#bfc8e6] hover:bg-[#2a3142]"
            }`}
            aria-label="Voice Input"
            onClick={() => setListening(l => !l)}
          >
            <MicIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}