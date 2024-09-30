import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../App.css";

const email = localStorage.getItem("email") || "Anonymous";
const name = localStorage.getItem("name") || "Anonymous";

const socket = io("http://localhost:5000", { query: { email, name } });

function Chat() {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);

  const chatWindowRef = useRef(null);

  const fetchMessages = async (recipientEmail) => {
    try {
      const senderEmail = email;
      const response = await axios.post(
        "http://localhost:5000/api/auth/findmessage",
        {
          senderEmail,
          recipientEmail,
        }
      );

      if (response.data) {
        setMessages(response.data); // Fetch and set messages
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.log("Failed to get messages:", error);
      alert("Failed to get messages");
    }
  };

  useEffect(() => {
    socket.on("receiveChatMessage", (msg) => {
      if (msg.recipientEmail === email || msg.senderEmail === email) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    socket.on("userList", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off("receiveChatMessage");
      socket.off("userList");
    };
  }, [selectedRecipientId]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!selectedRecipientId) {
      return alert("Please select a user to send a message!");
    }

    if (messageContent.trim()) {
      const recipient = users.find((user) => user.id === selectedRecipientId);
      socket.emit("sendPrivateMessage", {
        message: messageContent,
        recipientId: selectedRecipientId,
        recipientEmail: recipient.email,
        senderEmail: email,
        senderName: name,
        Date: new Date().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }),
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: messageContent,
          id: socket.id,
          senderEmail: email,
          name,
          recipientId: selectedRecipientId,
          recipientEmail: recipient.email,
          Date: new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }),
        },
      ]);
      setMessageContent("");
    }
  };

  const selectRecipient = (userId) => {
    setSelectedRecipientId(userId);
    const recipient = users.find((user) => user.id === userId);
    if (recipient) {
      setMessages([]);
      fetchMessages(recipient.email);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderEmail === email &&
        msg.recipientEmail ===
          users.find((user) => user.id === selectedRecipientId)?.email) ||
      (msg.recipientEmail === email &&
        msg.senderEmail ===
          users.find((user) => user.id === selectedRecipientId)?.email)
  );

  return (
    <div className="chat-app-container">
      <div className="chat-header">Chat Application</div>
      <div className="chat-container">
        <div className="user-list">
          <h3 style={{ fontSize: "20px", fontWeight: "500" }}>Me: {name}</h3>
          {users.map((user, idx) => (
            <div
              key={idx}
              className={`user-item ${
                selectedRecipientId === user.id ? "selected" : ""
              }`}
              onClick={() => selectRecipient(user.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                padding: "10px",
                borderTop: "1px solid #ccc",
              }}
            >
              <div>
                {user.email === email ? (
                  ""
                ) : (
                  <img
                    src="https://assets-us-01.kc-usercontent.com/5cb25086-82d2-4c89-94f0-8450813a0fd3/0c3fcefb-bc28-4af6-985e-0c3b499ae832/Elon_Musk_Royal_Society.jpg?fm=jpg&auto=format"
                    alt="profile"
                    className="avatar"
                  />
                )}
              </div>
              <div style={{ marginLeft: "10px" }}>
                {user.email === email ? "" : <div>{user.names}</div>}
                {/* <div className="last-message">{user.lastMessage}</div> */}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          <div style={{ position: "sticky", top: -15, backgroundColor:'#948f8f' }}>
            <div className="chat-header-recipient" >
              <img
                style={{ height: "50px", borderRadius: "100px" }}
                src="https://assets-us-01.kc-usercontent.com/5cb25086-82d2-4c89-94f0-8450813a0fd3/0c3fcefb-bc28-4af6-985e-0c3b499ae832/Elon_Musk_Royal_Society.jpg?fm=jpg&auto=format"
                alt={`${
                  users.find((user) => user.id === selectedRecipientId)
                    ?.names || "Recipient"
                } profile`}
              />
              <div>
                {users.find((user) => user.id === selectedRecipientId)?.names ||
                  "Select a user"}
              </div>
            </div>
          </div>

          {filteredMessages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.senderEmail === email ? "my-message" : "other-message"
              }
            >
              {msg.message}
              <div
                className={msg.senderEmail === email ? "my-mess" : "other-mess"}
              >
                {msg.Date}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="input-box">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
