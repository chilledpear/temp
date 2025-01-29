import { useState } from "react";
import "../assets/styles.css"; // Ensure the styles file is in the right path

const ChatApp = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState(""); // User input
  const [loading, setLoading] = useState(false); // Loading state

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return; // Ignore empty input

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]); // Update chat history
    setInput(""); // Clear input field
    setLoading(true); // Show loading state

    try {
      const baseUrl = window.location.origin; // Use correct URL dynamically
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "Ling Ling AI", text: data.response }]);
    } catch (error) {
      console.error("❌ Error calling API:", error);
      setMessages((prev) => [...prev, { sender: "Ling Ling AI", text: "API request failed. Try again!" }]);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container">
      {/* Title Section */}
      <div className="title-container">
        <div className="image-text">$LLLM - Ling Ling Language Model</div>
        <div className="contract-text">Contract Address: 5qjEK3mzePEqBYCafM5JVfd9oNmBH65dhu7eCNTqpump</div>
      </div>

      {/* Image Section */}
      <div className="image-box">
        <img src="/DLM.jpg" alt="Ling Ling AI" className="center-image" />
      </div>

      {/* Chat Box Section */}
      <div className="chat-box">
        <div className="chat-display">
          {messages.length === 0 && <p className="placeholder">Start a conversation...</p>}
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender === "User" ? "user-message" : "ai-message"}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          {loading && <p className="loading">Ling Ling AI is thinking...</p>}
        </div>

        {/* Input Section */}
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
