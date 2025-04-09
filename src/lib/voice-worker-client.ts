const worker = new Worker(new URL('../workers/voiceWorker.ts', import.meta.url), { type: 'module' });

interface WorkerRequest {
  id: string;
  type: 'processAudio' | 'analyzeAudio' | 'processCommand';
  payload: any;
}

interface WorkerResponse {
  id: string;
  result?: any;
  error?: string;
}

function callWorker<T>(type: WorkerRequest['type'], payload: any): Promise<T> {
  const id = crypto.randomUUID();

  return new Promise<T>((resolve, reject) => {
    const listener = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.id === id) {
        worker.removeEventListener('message', listener);
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data.result);
        }
      }
    };

    worker.addEventListener('message', listener);
    worker.postMessage({ id, type, payload });
  });
}

export async function processAudioInWorker(input: Float32Array): Promise<Float32Array> {
  const result = await callWorker<Float32Array>('processAudio', input);
  return new Float32Array(result);
}

export async function analyzeAudioInWorker(input: Float32Array): Promise<number> {
  return callWorker<number>('analyzeAudio', input);
}

export async function processCommandInWorker(text: string): Promise<string> {
  return callWorker<string>('processCommand', text);
}