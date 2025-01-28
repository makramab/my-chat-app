import React, { useState } from "react";
import "./App.css"; // Optional: for your custom styling

function App() {
  // State to store all chat messages
  const [messages, setMessages] = useState([]);
  // State to keep track of the current input
  const [newMessage, setNewMessage] = useState("");
  // (Optional) State to indicate loading while waiting for Ollama’s response
  const [loading, setLoading] = useState(false);

  // Function to handle sending a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // 1. Add the user's message to the chat first
    const userMessage = { sender: "You", text: newMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage("");

    // 2. Prepare a request to Ollama’s API
    try {
      setLoading(true);

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // The user's input becomes the prompt
          prompt: newMessage,
          // Adjust the model name or any other params as needed
          model: "deepseek-r1:1.5b",
          stream: false,
        }),
      });

      // 3. Parse Ollama’s response
      const data = await response.json();
      // The Ollama non-streaming response often returns an array in data.data
      // Each item in the array has a `response` field
      // e.g. { data: [ { response: "AI Response ..." } ] }
      const botResponse = data.response;

      // 4. Add the bot’s response to the chat
      const botMessage = { sender: "AI Chat", text: botResponse || "(No response)" };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling Ollama API:", error);
      // Optionally, add an error message to the chat
      const errorMessage = { sender: "AI Chat", text: "Error: Could not get a response" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a message when user presses 'Enter'
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <h1>Ollama Chat</h1>
      <div className="chat-container">
        {/* Chat Messages */}
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
          {loading && (
            <div className="message bot-message">
              <strong>AI Chat:</strong> Thinking...
            </div>
          )}
        </div>

        {/* Input Field and Send Button */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
