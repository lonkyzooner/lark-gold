import React from 'react';
import ConversationPanel from './ConversationPanel';
import MapPanel from './MapPanel';
import VoiceModule from './VoiceModule';
import ReportEditor from './ReportEditor';

const AssistantDashboard: React.FC = () => {
  const [showReport, setShowReport] = React.useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Conversation and suggestions */}
        <div className="flex flex-col w-1/2 border-r border-gray-700 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ConversationPanel />
          </div>
          <div className="border-t border-gray-700 p-2">
            <VoiceModule />
          </div>
        </div>

        {/* Right: Map and workflow status */}
        <div className="flex flex-col w-1/2 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MapPanel />
          </div>
          <div className="border-t border-gray-700 p-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Workflow: <span className="text-green-400">On Scene</span></div>
            <div className="text-sm">System Status: <span className="text-yellow-400">Monitoring</span></div>
          </div>
        </div>
      </div>

      {/* Bottom bar for alerts, suggestions, and report toggle */}
      <div className="border-t border-gray-700 p-3 flex gap-4 overflow-x-auto bg-gray-800">
        <div className="bg-yellow-500 text-black px-4 py-2 rounded shadow hover:bg-yellow-400 cursor-pointer transition">
          Request backup?
        </div>
        <div
          className="bg-blue-500 px-4 py-2 rounded shadow hover:bg-blue-400 cursor-pointer transition"
          onClick={() => setShowReport(!showReport)}
        >
          {showReport ? 'Hide Report' : 'Open Report'}
        </div>
        <div className="bg-green-500 px-4 py-2 rounded shadow hover:bg-green-400 cursor-pointer transition">
          Notify dispatch
        </div>
      </div>

      {/* Report drawer */}
      {showReport && (
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-11/12 h-5/6 p-4 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Incident Report</h2>
              <button
                onClick={() => setShowReport(false)}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <ReportEditor />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantDashboard;