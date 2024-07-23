import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaMicrophone } from "react-icons/fa";
import "./ChatContent.css";
import axios from 'axios';
import qs from 'qs';
import UniPal from '../ImageSource/UniPal.png'

const ChatContent = () => {
  const [message, setMessage] = useState("");
  const [APIresponse, setAPIResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioElementRef = useRef(null);
  const [chats, setChats] = useState([]);

  const userMessage = qs.stringify({ message: message });

  const handleSubmit =  async (e) => {

    addMessage('user', message);

    e.preventDefault();
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8000/generate/",
      timeout: 8000,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: userMessage,
    };
    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setAPIResponse(response.data.generated_text);
      if (response.data.generated_text) {
        addMessage('up', response.data.generated_text);
      }

    })
    .catch((error) => {
      console.log(error);
    });

    document.getElementsByClassName('ChatContent__input-bar')[0].value = '';
    document.getElementsByName('message')[0].placeholder = 'Ketik apa yang ingin kamu tanyakan...';

  };

  const handleGenerateSpeech = () => {
    if (isTalking) {
      stopSpeech();
    } else {
      startSpeech();
    }
  };

  const startSpeech = async () => {
    setIsTalking(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: APIresponse }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Automatically play the audio
      const audioElement = document.getElementById('audio-player');
      audioElementRef.current = audioElement;
      if (audioElement) {
        audioElement.play();
        document.getElementsByClassName('ChatContent__message-content')[chats.length - 1].style.backgroundColor = '#402DD8';
        await new Promise(resolve => setTimeout(resolve, audioElement.duration * 1000));
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const stopSpeech = async () => {
    setIsTalking(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    document.getElementsByClassName('ChatContent__message-content')[chats.length - 1].style.backgroundColor = '#303030';
  }

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    document.getElementsByClassName('ChatContent__input-bar')[0].disabled = true
    document.getElementsByName('message')[0].placeholder = 'Sedang merekam...';
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob);

          try {
            const response = await axios.post('http://localhost:3000/api/transcribe', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            setTranscription(response.data.transcription);
            setMessage(response.data.transcription);
          } catch (error) {
            console.error('Error transcribing speech:', error);
          }
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    document.getElementsByClassName('ChatContent__input-bar')[0].disabled = false;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    document.getElementsByName('message')[0].placeholder = message;
  };

  const addMessage = (sender, message) => {
    const new_chat = {
      sender: sender,
      msg: message
    };
    setChats(chats => [...chats, new_chat]);
  }

  const getMessage = () => {
    return chats.length == 0 ? <p>Tanya Sekarang</p>: (
      <div>
        {chats.map(chat => (
          <div className={"ChatContent__message" + (chat.sender != 'up' ? ' own' : '')}>
            <div className="ChatContent__chat-profile">
              <img src={chat.sender != 'up' ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyAxNh2rjbZUudzgaTCw01rJTrJsgsHYFgHQ&s": UniPal} alt="" className="ChatContent__profile-picture"/>
              <span className="ChatContent__name">{chat.sender != 'up' ? 'Name': 'UniPal'}</span>
            </div>
            <button className="ChatContent__message-content" onClick={chat.sender != 'up' ? '': handleGenerateSpeech}>{chat.msg}</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ChatContent">
      <div className="ChatContent__header">
        <h1 className="logo">UniPal</h1>
      </div>
      <div className="ChatContent__chat">
        <div className="ChatContent__chat-item">
          {getMessage()}
          {audioUrl && <audio id="audio-player" src={audioUrl} controls autoPlay />}
        </div>
      </div>
      <div className="ChatContent__input">
        <form action="post" onSubmit={handleSubmit} className="ChatContent__input--form">
          <input
            autoComplete="off"
            className="ChatContent__input-bar"
            name="message"
            type="text"
            placeholder="Ketik apa yang ingin kamu tanyakan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="ChatContent__chat-btn-container">
            <button type="submit" className="ChatContent__input-btn">
              <FaArrowRight />
            </button>
            <button type="button" onClick={handleRecording} className="ChatContent__record-btn">
              <FaMicrophone />
            </button>
          </div>
          {/* TO CHECK TRANSCRIPTION OUTPUT */}
          {/* {transcription && (
            <div>
              <h2>Transcription:</h2>
              <p>{transcription}</p>
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
