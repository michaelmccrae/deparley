import React from 'react';
import styles from './style.module.css';
import { CircleCheckBig, Circle } from 'lucide-react';

const messages = [
  { id: 1, text: 'Hi there!', sender: 'user', similar: false },
  { id: 2, text: 'Hello! How can I help you today?', sender: 'bot' },
  { id: 3, text: 'I need some information about your services.', sender: 'user', similar: true },
  { id: 4, text: 'Sure! We offer a range of services including web development, mobile app development, and UI/UX design.', sender: 'bot' },
  { id: 5, text: 'That sounds great!', sender: 'user', similar: false },
];

const ChatInterface = () => {
  return (
    <div className={styles.chatContainer}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <CircleCheckBig color="black" />
        <CircleCheckBig color="black" />
        <Circle color="black" />
        <Circle color="lightgrey" />
        <Circle color="lightgrey" />
        <Circle color="lightgrey" />
      </div>

      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        const isSimilar = msg.similar;

        const bubbleClass = isUser
          ? isSimilar
            ? styles.userBubbleSimilar
            : styles.userBubbleNotSimilar
          : styles.botBubble;

        return (
          <div key={msg.id} className={`${styles.chatBubble} ${bubbleClass}`}>
            {isUser && isSimilar && <CircleCheckBig className={styles.icon} />}
            {msg.text}
          </div>
        );
      })}
    </div>
  );
};

export default ChatInterface;
