import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

function Chat({ token }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    if (res.ok) {
      setChat([...chat, { sender: "You", text: message }, { sender: "Bot", text: data.reply }]);
      setMessage("");
    } else {
      alert(data.detail || "Error sending message");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={msg.sender === "You" ? "user-msg" : "bot-msg"}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Chat;
