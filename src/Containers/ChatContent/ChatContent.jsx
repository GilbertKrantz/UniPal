import React, { useState, useRef } from "react";
import { FaArrowRight, FaMicrophone } from "react-icons/fa";
import "./ChatContent.css";
import axios from 'axios';
import qs from 'qs';

const ChatContent = () => {
  const [message, setMessage] = useState("");
  const [APIresponse, setAPIResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const userMessage = qs.stringify({ message: message });

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8000/generate/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: userMessage,
    };
    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setAPIResponse(response.data.generated_text);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGenerateSpeech = async () => {
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
      if (audioElement) {
        audioElement.play();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
    document.getElementsByName('message')[0].placeholder = 'Recording...';
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
    document.getElementsByClassName('ChatContent__input-bar')[0].disabled = false
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    document.getElementsByName('message')[0].placeholder = message;
  };

  return (
    <div className="ChatContent">
      <div className="ChatContent__header">
        <h1 className="ChatContent__header-title">UniPal</h1>
      </div>
      <div className="ChatContent__chat">
        <div className="ChatContent__chat-item">
          {APIresponse ? <p>{APIresponse}</p> : <p>Chat Now</p>}
        </div>
        <div className="ChatContent__chat-item">
          {APIresponse && <button className="ChatContent__chat-speak" onClick={handleGenerateSpeech}>Speak</button>}
          {audioUrl && <audio id="audio-player" src={audioUrl} controls autoPlay />}
        </div>
      </div>
      <div className="ChatContent__input">
        <form action="post" onSubmit={handleSubmit} className="ChatContent__input--form">
          <input
            className="ChatContent__input-bar"
            name="message"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="ChatContent__input-btn">
            <FaArrowRight />
          </button>
          <button type="button" onClick={handleRecording} className="ChatContent__record-btn">
            <FaMicrophone />
          </button>
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
