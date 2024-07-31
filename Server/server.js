import express from 'express';
import TextToSpeechService from './API/TextToSpeech/TextToSpeechService.js';
import SpeechToTextService from './API/SpeechToText/SpeechToTextService.js';
import GenAIService from './API/GenAI/GenAI.js';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import ELTextToSpeech from './API/ELTextToSpeech/ELTextToSpeech.js';
import { readFileSync, writeFileSync } from 'fs';
import { ExtractJwt } from 'passport-jwt';

const SECRET_KEY = 'your_secret_key';

const dataPath = '../src/UserData/UserData.json';
const users = JSON.parse(readFileSync(dataPath, 'utf8'));

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const ttsService = new TextToSpeechService('Key/text-to-speech/unipal-text-to-speech-key.json');
const stsService = new SpeechToTextService('Key/speech-to-text/unipal-speech-to-text-key.json');
const eltts = new ELTextToSpeech('Key/el-text-to-speech/el-text-to-speech.txt');
// const aiService = new GenAIService();
// aiService.initialize('./Key/gemini/API_Key.txt');

const upload = multer();

const findUser = (email) => {
  let low = 0;
  let high = users.length - 1;
  let mid;
  let key;

  while (high >= low) {
    mid = low + Math.floor((high - low) / 2);
    key = Object.keys(users[mid])[0];

    if (key.localeCompare(email) == 0)
        return mid;

    if (key.localeCompare(email) > 0)
        high = mid - 1;

    else
        low = mid + 1;
  }

  return null;

}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);

    if (!message) {
      return res.status(400).send('Message is required');
    }

    // set message as string text
    const text = message.message;

    const response = await aiService.send(text);
    console.log('Response:', response);
    res.send({ response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Internal Server Error');
  }

});


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

app.post('/api/elgenerate', async (req, res) => {
  try {
    console.log('Generating ElevenLabs Speech...');
    const { text } = req.body;
    console.log('Received Text:', text);

    if (!text) {
      return res.status(400).send('Text is required');
    }

    const audioContent = await eltts.generate(text);
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'inline; filename="output.wav"'
    })
    res.send(audioContent);
    console.log('Finished Generating ElevenLabs Speech...');
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

  const user = users[findUser(email)][email];
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

app.post('/register', (req, res) => {
  try {
    const { email, username, gender, password } = req.body;

    console.log('Received register request:', email, username);

    if (findUser(email) != null) {
      console.log('Email already registered');
      return res.status(401).json({ message: "Email already registered" });
    }

    const newUser = {
      [email]: {
        username: username,
        gender: gender,
        password: password,
        profilePicture: 'default'
      }
    }

    users.push(newUser);

    writeFileSync(dataPath, JSON.stringify(users));
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ONLY USE WITH CAUTION SINCE THIS METHOD IS TO DELETE ALL USER DATA!
app.post('/cleardata', (req, res) => {
  writeFileSync(dataPath, JSON.stringify([]));
  users.splice(0, users.length);
  console.log('ALL DATA HAS BEEN DELETED');
  return res.status(200).json({ message: "All data have been deleted!" });
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
