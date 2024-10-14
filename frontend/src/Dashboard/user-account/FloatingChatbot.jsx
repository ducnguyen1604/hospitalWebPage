import React, { useState } from "react";
import axios from "axios";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  // Text-to-speech function
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  // Speech recognition for voice input (Web Speech API)
  const handleSpeechInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"; // Set the language to English
    recognition.interimResults = false; // We only want the final result
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(`You said: ${transcript}`);
      setUserMessage(transcript); // Set the recognized speech to the input
      handleSendMessage(); // Automatically send the message
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start(); // Start listening
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const response = await axios.post("http://localhost:5001/api/chat", {
        message: userMessage,
      });

      const botMessage = response.data.reply;
      const doctorUri = response.data.doctor_uri;

      if (botMessage) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botMessage, uri: doctorUri },
        ]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching response from chatbot:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to get response from chatbot" },
      ]);
    }

    // Clear input field
    setUserMessage("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        width: isOpen ? "300px" : "50px",
        height: isOpen ? "400px" : "50px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          width: "100%",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#007BFF", // Light blue header
          color: "white",
          fontWeight: "bold",
          borderBottom: "1px solid #ddd",
        }}
      >
        {isOpen ? "❌  Close Chat with AI" : "AI 💬"}
      </div>
      {isOpen && (
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            height: "350px",
            backgroundColor: "#f4f7f9",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.sender === "user" ? "right" : "left",
                  margin: "5px 0",
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      message.sender === "user" ? "#DCF8C6" : "#007BFF",
                    color: message.sender === "user" ? "black" : "white",
                    padding: "10px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>
                    {message.sender === "user" ? "You" : "AI Response"}:{" "}
                  </strong>
                  {message.text}
                  {message.uri && (
                    <div style={{ marginTop: "5px" }}>
                      <a
                        href={message.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#007BFF",
                          textDecoration: "underline",
                        }}
                      >
                        Doctor's Profile
                      </a>
                    </div>
                  )}
                  {/* Add Read Aloud button for bot messages */}
                  {message.sender === "bot" && (
                    <button
                      onClick={() => speak(message.text)}
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      🔊 Read Aloud
                    </button>
                  )}
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
              flex: "0",
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              marginBottom: "10px",
            }}
          />
          {/* Microphone Button for Speech Input */}
          <button
            onClick={handleSpeechInput}
            style={{
              padding: "10px",
              backgroundColor: "#28a745", // Green button for mic input
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            🎤 Speak
          </button>
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px",
              backgroundColor: "#007BFF", // Light blue button
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
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
