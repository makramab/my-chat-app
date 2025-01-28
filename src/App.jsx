import React, { useState } from "react";
import "./App.css"; // Optional: For your custom styling

function App() {
  // State to store all chat messages
  const [messages, setMessages] = useState([]);

  // State to keep track of the current input
  const [newMessage, setNewMessage] = useState("");

  // Function to handle sending a new message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user's message to the list
    const updatedMessages = [
      ...messages,
      {
        sender: "You",
        text: newMessage,
      },
    ];

    // Generate a random integer for the bot response
    const randomBotMessage = Math.floor(Math.random() * 1000);

    // Add bot's response
    updatedMessages.push({
      sender: "AI Agent",
      text: randomBotMessage.toString(),
    });

    // Update state
    setMessages(updatedMessages);

    // Reset input
    setNewMessage("");
  };

  // Handle sending a message when user presses 'Enter'
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <h1>Simple Chat</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "You" ? "message user-message" : "message bot-message"
              }
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
