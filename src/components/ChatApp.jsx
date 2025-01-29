import { useState } from "react";
import "../assets/styles.css"; // Ensure the styles file is in the right path
import dlmImage from "../assets/DLM.jpg"; // Import the image

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "American", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "Ling Ling", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "Ling Ling", text: "Try again gringo" }]);
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
        <img src={dlmImage} alt="Ling Ling Language Model" className="center-image" />
      </div>

      {/* Chat Box Section */}
      <div className="chat-box">
        <div className="chat-display">
          {messages.map((msg, i) => (
            <div key={i}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
