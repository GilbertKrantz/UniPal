import textToSpeech from '@google-cloud/text-to-speech';
import { config } from 'dotenv';

config();

class TextToSpeechService {
  constructor() {
    this.client = new textToSpeech.TextToSpeechClient();
  }

  async generate(text) {
    const request = {
      input: { text: text },
      voice: { languageCode: 'id-ID', name: 'id-ID-Standard-A' },
      audioConfig: { audioEncoding: 'LINEAR16', speakingRate: 1.0, pitch: 2.0 },
    };

    const [response] = await this.client.synthesizeSpeech(request);
    return response.audioContent;
  }
}

export default TextToSpeechService;
