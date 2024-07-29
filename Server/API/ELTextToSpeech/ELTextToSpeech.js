import { ElevenLabsClient, play } from 'elevenlabs';
import { createWriteStream } from 'fs';
import { readFileSync } from 'fs';

class ELTextToSpeech {
  constructor(credentialsPath){
      const credentials = readFileSync(credentialsPath);
      this.client = new ElevenLabsClient({
          apiKey: credentials
      });
  }

  async generate(text) {
    return new Promise(async (reject) => {
      try {
        const audio = await this.client.generate({
          voice: "Meraki female Indonesian voice",
          model_id: "eleven_multilingual_v2",
          text,
        });
        await play(audio);
      } catch (error) {
        reject(error);
      }
    });
  };
}

export default ELTextToSpeech