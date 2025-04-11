import React, { useState, useRef } from "react";
import { BookOpenIcon, SendIcon } from "lucide-react";

// Standardized, security-focused statute prompt
function buildStatutePrompt(query: string) {
  return `
As LARK, a Louisiana law enforcement legal assistant, provide a concise, factual summary of the following statute or legal situation for officer reference:

"${query}"

Include:
- Statute number and title (if applicable)
- Elements of the crime or violation
- Classification (felony/misdemeanor) and penalties
- Key considerations for law enforcement
- Related statutes or charges

If the query describes behavior but not a specific statute, identify the most relevant Louisiana criminal statutes. If uncertain, say so and advise the officer to verify the statute.
Respond in a clear, professional tone. Do not speculate or provide legal advice.
`;
}

export default function StatutesPanel() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate AI call (replace with real backend integration)
  const handleLookup = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    // Simulate network/AI delay
    setTimeout(() => {
      setResult(
        `Statute summary for "${query}":\n\n(This is a simulated response. Integrate backend AI here.)`
      );
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#181e2a] rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a3142] bg-[#23293a]">
        <div className="flex items-center gap-2 text-white text-2xl font-bold tracking-tight">
          <BookOpenIcon className="h-7 w-7" />
          Statute Lookup
        </div>
        <div className="text-[#bfc8e6] text-base font-medium">Louisiana Law</div>
      </div>
      {/* Query Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form
          className="flex items-center gap-3 mb-6"
          onSubmit={e => {
            e.preventDefault();
            handleLookup();
          }}
        >
          <input
            ref={inputRef}
            className="flex-1 rounded-full bg-[#23293a] border border-[#2a3142] px-6 py-4 text-lg text-white placeholder-[#bfc8e6] focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter statute number or describe the situation"
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-[#25407a] hover:bg-[#3458a1] text-white rounded-full p-4 transition"
            aria-label="Lookup"
            disabled={loading}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
        {loading && (
          <div className="text-blue-200 text-center py-8">Looking up statute...</div>
        )}
        {result && (
          <div className="bg-[#e9ecf3] text-[#23293a] rounded-2xl px-6 py-5 shadow-lg mt-4 whitespace-pre-line">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}