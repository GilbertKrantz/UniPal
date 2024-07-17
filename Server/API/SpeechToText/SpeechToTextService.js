import speech from '@google-cloud/speech';
import { readFileSync } from 'fs';

class SpeechToTextService {
  constructor(credentialsPath) {
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
    this.client = new speech.SpeechClient({ credentials });
  }

  async transcribe(audioBuffer) {
    const audio = { content: audioBuffer.toString('base64') };
    const config = { encoding: 'LINEAR16', sampleRateHertz: 48000, languageCode: 'en-US' };

    const request = { audio: audio, config: config };

    const [response] = await this.client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

    return transcription;
  }
}

export default SpeechToTextService;
