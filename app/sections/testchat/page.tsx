import React from "react";
import styles from "./styles.module.css";

const dummyMessages = [
  { id: 1, sender: "user", text: "Hi there!" },
  { id: 2, sender: "bot", text: "Hello! How can I assist you today?" },
  { id: 3, sender: "user", text: "I need help with my order." },
  { id: 4, sender: "bot", text: "Sure! Could you please provide your order ID?" },
];

const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      {dummyMessages.map((msg) => (
        <div
          key={msg.id}
          className={`${styles.chatBubble} ${
            msg.sender === "user" ? styles.userBubble : styles.botBubble
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default Chat;