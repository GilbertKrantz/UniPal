import express from 'express';
import TextToSpeechService from './API/TextToSpeech/TextToSpeechService.js';
import SpeechToTextService from './API/SpeechToText/SpeechToTextService.js';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

// Hardcoded credentials
const users = {
  "email1@email.com": { "username": "user1", "password": "password1" },
  "username2": { "email": "user2@example.com", "password": "password2" }
};

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const ttsService = new TextToSpeechService('Key/text-to-speech/unipal-text-to-speech-key.json');
const stsService = new SpeechToTextService('Key/speech-to-text/unipal-speech-to-text-key.json');

const upload = multer();

app.post('/api/generate', async (req, res) => {
  try {
    console.log('Generating speech...');
    const { text } = req.body;
    console.log('Received text:', text);

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

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Audio file is required');
    }
    console.log('Transcribing speech...');
    const audioBuffer = req.file.buffer;
    const transcription = await stsService.transcribe(audioBuffer);
    console.log('Transcription:', transcription);
    res.send({ transcription });
  } catch (error) {
    console.error('Error transcribing speech:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', email, password);

  if (!password || !email) {
      return res.status(400).json({ message: "Missing email or password" });
  }

  const user = users[email];
  if (user) {
    if (user.password === password) {
      const token = jwt.sign({ username: user.username, email }, SECRET_KEY, { expiresIn: '1h' });
      console.log('Login successful:', email);
      return res.status(200).json({ message: "Login successful", token }); 
    } else if (user.password !== password) {
      return res.status(401).json({ message: "Invalid Password" });
    }
  } else {
      return res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post('/verify', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
      return res.status(400).json({ message: "Token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(200).json({ message: "Token is valid", user: decoded.username, email: decoded.email });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
