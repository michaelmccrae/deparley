import React from 'react';
import styles from './style.module.css';

const ChatBubble = ({ messages }) => {
  return (
    <div className={styles.chatContainer}>
      {messages.map((msg, index) => {
        const bubbleClass =
          msg.sender === 'user'
            ? `${styles.bubble} ${styles.user}`
            : `${styles.bubble} ${styles.bot}`;

        return (
          <div key={index} className={bubbleClass}>
            {msg.text}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBubble;
