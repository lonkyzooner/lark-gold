import init, * as wasm from '../wasm/lark_voice_wasm.js';

let initialized = false;

self.onmessage = async (e) => {
  const { id, type, payload } = e.data;
  if (!initialized) {
    await init();
    initialized = true;
  }

  try {
    let result;
    switch (type) {
      case 'processAudio':
        result = wasm.process_audio(payload);
        break;
      case 'analyzeAudio':
        result = wasm.analyze_audio(payload);
        break;
      case 'processCommand':
        result = wasm.process_command(payload);
        break;
      default:
        throw new Error('Unknown message type');
    }
    self.postMessage({ id, result });
  } catch (error) {
    const message = (error instanceof Error) ? error.message : String(error);
    self.postMessage({ id, error: message });
  }
};