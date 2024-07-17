import express from 'express';
import TextToSpeechService from './API/TextToSpeech/TextToSpeechService.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS

const ttsService = new TextToSpeechService();

app.post('/api/generate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).send('Text is required');
    }
    const audioContent = await ttsService.generate(text);
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'inline; filename="output.wav"',
    });
    res.send(audioContent);
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
