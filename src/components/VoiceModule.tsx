import React, { useState } from 'react';
import { useLiveKitVoice } from '../contexts/LiveKitVoiceContext';
import { useLarkAgent } from '../contexts/LarkAgentContext';

const VoiceModule: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { sendText } = useLarkAgent();
  const [partial, setPartial] = useState('');

  // Simulate real-time transcription updates
  const simulateTranscription = () => {
    setPartial('Listening...');
    setTimeout(() => setPartial('Suspect is becoming agitated'), 1000);
    setTimeout(() => setPartial('Suspect is becoming agitated and raising voice'), 2000);
    setTimeout(() => {
      setTranscript('Suspect is becoming agitated and raising voice');
      setPartial('');
    }, 3000);
  };
  const { connect, disconnect, requestMicrophonePermission, isConnected, micPermission } = useLiveKitVoice();

  const toggleRecording = async () => {
    if (isRecording) {
      disconnect();
      setIsRecording(false);
      if (transcript.trim()) {
        await sendText(transcript.trim());
      }
    } else {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        alert('Microphone permission denied');
        return;
      }
      await connect(undefined, true);
      setIsRecording(true);
      simulateTranscription();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={toggleRecording}
        className={`px-4 py-2 rounded ${isRecording ? 'bg-red-600' : 'bg-green-600'} text-white`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Connection: {isConnected ? 'Connected' : 'Disconnected'}<br />
        Mic Permission: {micPermission}
      </div>
      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white min-h-[100px]">
        {partial ? <em>{partial}</em> : transcript || 'Voice transcript will appear here...'}
      </div>
    </div>
  );
};

export default VoiceModule;