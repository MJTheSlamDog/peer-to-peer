import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5173';

const GroupChat = () => {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // polling every 2s
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get(API_URL);
    setMessages(res.data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text || !username) return;
    await axios.post(API_URL, { username, text });
    setText('');
    fetchMessages();
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Group Chat</h2>

      {!username ? (
        <input
          placeholder="Enter your name"
          onBlur={(e) => setUsername(e.target.value)}
        />
      ) : (
        <>
          <div style={{ height: 300, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
            {messages.map((msg, idx) => (
              <div key={idx}><strong>{msg.username}:</strong> {msg.text}</div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ marginTop: 10, display: 'flex' }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message"
              style={{ flex: 1 }}
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default GroupChat;
