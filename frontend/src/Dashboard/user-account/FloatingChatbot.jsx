import React, { useState } from 'react';
import axios from 'axios';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add user message to the messages state
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    try {
      // Send the user message to the backend API
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
      });

      // Retrieve the chatbot response from the API
      const botMessage = response.data.response;

      // Add bot message to the messages state
      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      console.error('Error fetching response from chatbot:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error: Unable to get response from chatbot' },
      ]);
    }

    // Clear input
    setUserMessage('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        width: isOpen ? '300px' : '50px',
        height: isOpen ? '400px' : '50px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          width: '100%',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#007BFF', // Light blue header
          color: 'white',
          fontWeight: 'bold',
          borderBottom: '1px solid #ddd',
        }}
      >
        {isOpen ? '❌  Close Chat with AI' : 'AI 💬'}
      </div>
      {isOpen && (
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: '350px', backgroundColor: '#f4f7f9' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  margin: '5px 0',
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    backgroundColor: message.sender === 'user' ? '#DCF8C6' : '#007BFF',
                    color: message.sender === 'user' ? 'black' : 'white',
                    padding: '10px',
                    borderRadius: '15px',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  <strong>{message.sender === 'user' ? 'You' : 'AI Response'}: </strong>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: '0',
              padding: '10px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              marginBottom: '10px',
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: '10px',
              backgroundColor: '#007BFF', // Light blue button
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
