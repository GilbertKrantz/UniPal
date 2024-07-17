import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import './formComponent.css';

const FormComponent = () => {
  const [message, setMessage] = useState("");
  const [APIresponse, setAPIResponse] = useState("");
  
  let userMessage = qs.stringify({
    'message': message
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://127.0.0.1:8000/generate/',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : userMessage
    }
    axios(config).then((response) => {
      console.log(JSON.stringify(response.data));
      setAPIResponse(JSON.stringify(response.data.generated_text));
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <textarea
        name="message"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
    <div>
      <p>API Response: {APIresponse}</p>
      </div>
    </div>
    
  );
};

export default FormComponent;