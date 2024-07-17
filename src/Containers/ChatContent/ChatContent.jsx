import React, {useState} from "react";
import { FaArrowRight } from "react-icons/fa";
import "./ChatContent.css";

import axios from 'axios';
import qs from 'qs';

const ChatContent = () => {
  const [message, setMessage] = useState("");
  const [APIresponse, setAPIResponse] = useState("");

  let userMessage = qs.stringify({
    message: message,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8000/generate/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: userMessage,
    };
    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setAPIResponse(JSON.stringify(response.data.generated_text));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [audioUrl, setAudioUrl] = useState('');

  const handleGenerateSpeech = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: APIresponse }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="ChatContent">
      <div className="ChatContent__header">
        <h1 className="ChatContent__header-title">UniPal</h1>
      </div>
      <div className="ChatContent__chat">
        <div className="ChatContent__chat-item">
            {APIresponse ? (
                <p>{APIresponse}</p>
            ) : (
                <p>Chat Now</p>
            )}
            <button className="ChatContent__chat-speak" onClick={handleGenerateSpeech}>Speak</button>
            {audioUrl && <audio src={audioUrl} controls />}
        </div>
      </div>
      <div className="ChatContent__input">
        <form action="post" onSubmit={handleSubmit} className="ChatContent__input--form">
            <input className="ChatContent__input-bar" name="message" type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="submit" className="ChatContent__input-btn"><FaArrowRight /></button>
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
