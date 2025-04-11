import React, { useState } from "react";
import AssistantPanel from "./AssistantPanel";
import StatutesPanel from "./StatutesPanel";
import MirandaPanel from "./MirandaPanel";
import { Settings } from "./Settings";
import {
  MicIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  SettingsIcon,
  UserIcon,
  ShieldIcon,
  SendIcon,
  MapPinIcon,
  ClockIcon,
  BatteryFullIcon,
  WifiIcon
} from "lucide-react";

const TABS = [
  { key: "assistant", label: "Assistant", icon: <MicIcon className="h-5 w-5" /> },
  { key: "miranda", label: "Miranda", icon: <BookOpenIcon className="h-5 w-5" /> },
  { key: "statutes", label: "Statutes", icon: <BookOpenIcon className="h-5 w-5" /> },
  { key: "threats", label: "Threats", icon: <AlertTriangleIcon className="h-5 w-5" /> },
  { key: "tools", label: "Tools", icon: <ShieldIcon className="h-5 w-5" /> }
];

export default function LarkMainLayout() {
  const [activeTab, setActiveTab] = useState("assistant");
  const [showAccountModal, setShowAccountModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf1fa] to-[#dbe6f6] flex flex-col">
      {/* Header */}
      {/* Mobile-First Header */}
      <header className="flex items-center justify-between w-full px-4 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-blue-700" />
          </span>
          <span className="font-mono text-2xl text-blue-900 font-bold tracking-tight">LARK</span>
        </div>
        <button
          className="p-2 rounded-full bg-blue-100 text-blue-900 hover:bg-blue-200 transition"
          onClick={() => setShowAccountModal(true)}
          aria-label="Open menu"
        >
          {/* Hamburger icon */}
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect x="4" y="7" width="16" height="2" rx="1" fill="currentColor"/>
            <rect x="4" y="15" width="16" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
      </header>
      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold"
              onClick={() => setShowAccountModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <Settings />
          </div>
        </div>
      )}
      {/* Tab Bar */}
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-t flex justify-around items-center h-16 border-t border-blue-100">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? "text-blue-800"
                : "text-blue-900 hover:text-blue-700"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="mb-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Main Card Area */}
      {/* Main Content Area (with padding for header and bottom nav) */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 w-full">
        <div className="w-full max-w-4xl px-2">
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-8">
            {activeTab === "assistant" ? (
              <AssistantPanel />
            ) : activeTab === "miranda" ? (
              <MirandaPanel />
            ) : activeTab === "statutes" ? (
              <StatutesPanel />
            ) : (
              <div className="text-blue-400 text-center py-16">This feature is coming soon.</div>
            )}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2025 Zooner Enterprises &nbsp; | &nbsp; All Rights Reserved
      </footer>
    </div>
  );
}