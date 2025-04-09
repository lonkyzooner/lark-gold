import init, * as wasm from '../wasm/lark_voice_wasm.js';

let initialized = false;

async function initWasm() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export async function processAudio(input: Float32Array): Promise<Float32Array> {
  await initWasm();
  const result = wasm.process_audio(input);
  return new Float32Array(result);
}

export async function analyzeAudio(input: Float32Array): Promise<number> {
  await initWasm();
  return wasm.analyze_audio(input);
}

export async function processCommand(text: string): Promise<string> {
  await initWasm();
  return wasm.process_command(text);
}