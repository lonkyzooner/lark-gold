import React, { useState } from "react";
import {
  UserIcon,
  CarIcon,
  ScaleIcon,
  VolumeIcon,
  ShieldIcon,
  MapIcon,
  MicIcon,
  CameraIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const TOOL_LIST = [
  { key: "interview", label: "Interview", icon: <UserIcon className="h-6 w-6" /> },
  { key: "lookup", label: "Vehicle/ID", icon: <CarIcon className="h-6 w-6" /> },
  { key: "legal", label: "Legal", icon: <ScaleIcon className="h-6 w-6" /> },
  { key: "voice", label: "Voice", icon: <VolumeIcon className="h-6 w-6" /> },
  { key: "threats", label: "Threats", icon: <ShieldIcon className="h-6 w-6" /> },
  { key: "map", label: "Tactical Map", icon: <MapIcon className="h-6 w-6" /> }
];

interface StatusBarProps {
  status?: string;
  recording?: boolean;
  backup?: boolean;
  alert?: string;
}
function StatusBar({ status, recording, backup, alert }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between bg-blue-950/90 px-4 py-2 border-b border-blue-800 text-blue-200 text-xs font-mono">
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-900/60 text-blue-200 px-2 py-1">LARK ACTIVE</Badge>
        {status && <span>Status: {status}</span>}
        {recording && (
          <span className="flex items-center gap-1 text-red-400">
            <CameraIcon className="h-4 w-4 animate-pulse" /> Recording
          </span>
        )}
        {backup && (
          <span className="flex items-center gap-1 text-yellow-400">
            <AlertTriangleIcon className="h-4 w-4 animate-bounce" /> Backup Requested
          </span>
        )}
        {alert && (
          <span className="flex items-center gap-1 text-red-500 font-bold">
            <AlertTriangleIcon className="h-4 w-4 animate-pulse" /> {alert}
          </span>
        )}
      </div>
      <div>
        <span className="flex items-center gap-1 text-green-400">
          <CheckCircleIcon className="h-4 w-4" /> Secure
        </span>
      </div>
    </div>
  );
}

export default function ToolsOverhauled() {
  const [activeTool, setActiveTool] = useState("interview");
  // Example status, in real app these would come from context or props
  const status = "On Scene";
  const recording = true;
  const backup = false;
  const alert = "";

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900">
      <StatusBar status={status} recording={recording} backup={backup} alert={alert} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-24 bg-black/80 border-r border-blue-900 flex flex-col items-center py-6 gap-4">
          {TOOL_LIST.map(tool => (
            <Button
              key={tool.key}
              variant={activeTool === tool.key ? "default" : "ghost"}
              className={`flex flex-col items-center justify-center w-16 h-16 mb-2 rounded-lg ${activeTool === tool.key ? "bg-blue-800 text-blue-200" : "text-blue-400"}`}
              aria-label={tool.label}
              onClick={() => setActiveTool(tool.key)}
            >
              {tool.icon}
              <span className="text-xs mt-1">{tool.label}</span>
            </Button>
          ))}
        </nav>
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTool === "interview" && (
            <div className="rounded-xl bg-blue-950/60 border border-blue-900/40 p-6 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-blue-200 text-xl font-bold mb-4 flex items-center gap-2">
                <UserIcon className="h-6 w-6" /> Field Interview
              </h2>
              {/* InterviewTool component goes here */}
              <div className="text-blue-300">Interview tool UI (to be implemented)</div>
            </div>
          )}
          {activeTool === "lookup" && (
            <div className="rounded-xl bg-blue-950/60 border border-blue-900/40 p-6 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-blue-200 text-xl font-bold mb-4 flex items-center gap-2">
                <CarIcon className="h-6 w-6" /> Vehicle/ID Lookup
              </h2>
              {/* LookupTool component goes here */}
              <div className="text-blue-300">Lookup tool UI (to be implemented)</div>
            </div>
          )}
          {activeTool === "legal" && (
            <div className="rounded-xl bg-blue-950/60 border border-blue-900/40 p-6 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-blue-200 text-xl font-bold mb-4 flex items-center gap-2">
                <ScaleIcon className="h-6 w-6" /> Legal Resources
              </h2>
              {/* LegalTool component goes here */}
              <div className="text-blue-300">Legal tool UI (to be implemented)</div>
            </div>
          )}
          {activeTool === "voice" && (
            <div className="rounded-xl bg-blue-950/60 border border-blue-900/40 p-6 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-blue-200 text-xl font-bold mb-4 flex items-center gap-2">
                <VolumeIcon className="h-6 w-6" /> Voice Test
              </h2>
              {/* VoiceTool component goes here */}
              <div className="text-blue-300">Voice tool UI (to be implemented)</div>
            </div>
          )}
          {activeTool === "threats" && (
            <div className="rounded-xl bg-blue-950/60 border border-blue-900/40 p-6 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-blue-200 text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldIcon className="h-6 w-6" /> Threat Detection
              </h2>
              {/* ThreatDetection component goes here */}
              <div className="text-blue-300">Threat detection UI (to be implemented)</div>
            </div>
          )}
          {activeTool === "map" && (
            <div className="rounded-xl bg-blue-950/60 border border-blue-900/40 p-6 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-blue-200 text-xl font-bold mb-4 flex items-center gap-2">
                <MapIcon className="h-6 w-6" /> Tactical Map
              </h2>
              {/* MapTool component goes here */}
              <div className="text-blue-300">Tactical map UI (to be implemented)</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}