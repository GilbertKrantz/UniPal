import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaMicrophone, FaUser } from "react-icons/fa";
import "./ChatContent.css";
import axios from 'axios';
import UniPal from '../../Assets/Logo/UniPal.png';

// Firebase SDK
import { auth, db } from "../../Firebase"
// Firebase Firestore SDK
import { getDoc, doc } from "firebase/firestore";

const ChatContent = () => {
  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioElementRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);

  const endRef = useRef(null);

  const [userProfile, setUserProfile] = useState('');

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [chats]);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        console.log('No User!!!!');
      }
    });
  }

  useEffect(() => {
    fetchUserData();
  })

  useEffect(() => {
    const messageButton = document.getElementsByClassName('ChatContent__message-content')[chats.length - 1];

    if (isTalking && isGeneratingSpeech) {
      messageButton.style.backgroundColor = '#0B409C';
    }

    if (isTalking && !isGeneratingSpeech) {
      startSpeechHelper();
      startSpeech();
    }

  }, [isGeneratingSpeech, isTalking]);

  const getProfilePicture = (sender, header = false) => {

    if (sender != 'up') {
      if (userProfile['profilePicture'] == 'default') {
        return (
          <div className={header? "ChatContent__header-profile--default": "ChatContent__profile-image--default"}>
            <FaUser />
          </div>
        );
      }
      
      return (<img src={userProfile['profilePicture']} alt="" className="ChatContent__profile-image"/>);
    }
    
    return (<img src={UniPal} alt="" className="ChatContent__profile-image"/>);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!message) {
      return;
    }
    
    addMessage('user', message);
    setMessage('');
    
    try {
      
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      })

      if (!response.ok) {
        throw new Error('Can not generate message');
      }

      const data = await response.json();

      if (data.response) {
        addMessage('up', data.response);
        getSpeech(data.response);
      }

    } catch (error) {
      console.error('Error:', error);
    }

  };

  const handleGenerateSpeech = async () => {
    if (isTalking) {
      stopSpeech();
    } else {
      startSpeech();
    }
  };

  const startSpeechHelper = () => {
    document.getElementsByClassName('ChatContent__message-content')[chats.length - 1].style.backgroundColor = '#402DD8';
  }

  const getSpeech = async (text) => {
    try {

      setIsGeneratingSpeech(true);
      
      // GOOGLE TTS
      
      // const response = await fetch('http://localhost:3000/api/generate', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ text: text }),
      //   });
        
        // ELEVENLABS TTS
        
      const response = await fetch('http://localhost:3000/api/elgenerate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      setIsGeneratingSpeech(false);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const startSpeech = async () => {

    setIsTalking(true);

    // Automatically play the audio
    if (!isGeneratingSpeech) {
      const audioElement = document.getElementById('audio-player');
      audioElementRef.current = audioElement;
      if (audioElement) {
        audioElement.play();
      }
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
    setMessage('');
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
    document.getElementsByName('message')[0].placeholder = 'Ketik apa yang ingin kamu tanyakan...';
  };

  const addMessage = (sender, message) => {
    const new_chat = {
      sender: sender,
      msg: message,
    };
    setChats(chats => [...chats, new_chat]);
  }

  const getMessage = () => {
    return chats.length == 0 ? <p className="">Tanya Sekarang</p>: (
      <div className="ChatContent__chat-item">
        {chats.map(chat => (
          <div className={"ChatContent__message" + (chat.sender != 'up' ? ' own' : '')}>
            <div className="ChatContent__chat-profile">
              <div className="ChatContent__profile-picture">
                {getProfilePicture(chat.sender)}
              </div>
              <span className="ChatContent__name">{chat.sender != 'up' ? userProfile['username']: 'UniPal'}</span>
            </div>
            <button className="ChatContent__message-content" onClick={chat.sender != 'up' ? null: handleGenerateSpeech}>{chat.msg}</button>
            {/* {chat.sender == 'up' && audioUrl && <audio id="audio-player" src={audioUrl} controls autoPlay onPlay={startSpeechHelper} onEnded={stopSpeech}/>} */}
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
    );
  }

  return (
    <div className="ChatContent">
      <div className="ChatContent__header">
        <div className="ChatContent__header-logo">
          <img src={UniPal} alt="" className="ChatContent__profile-image"/>
        </div>
        <h1 className="logo">UniPal</h1>
        <div className={"ChatContent__header-profile"}>
          {getProfilePicture('user', true)}
        </div>
      </div>
      <div className={"ChatContent__chat " + (chats.length == 0 ? "ChatContent__chat--empty" : "ChatContent__chat--filled")}>
        {getMessage()}
        {audioUrl && <audio id="audio-player" src={audioUrl} controls onPlay={startSpeechHelper} onEnded={stopSpeech}/>}
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
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
