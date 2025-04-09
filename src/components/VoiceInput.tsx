import React from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const {
    listening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (!listening && transcript.trim()) {
      onTranscript(transcript.trim());
    }
  }, [listening, transcript, onTranscript]);

  if (!hasRecognitionSupport) {
    return <div className="p-2 text-sm text-gray-500">Speech recognition not supported in this browser.</div>;
  }

  return (
    <div className="flex items-center p-2 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className={`px-4 py-2 rounded transition ${
          listening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {listening ? 'Stop Listening' : 'Start Voice Input'}
      </button>
      {error && <div className="text-red-500 text-xs ml-2">{error}</div>}
    </div>
  );
};

export default VoiceInput;