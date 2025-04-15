import React from 'react';
import ChatBubble from './ChatBubble';

const dummyMessages = [
  { sender: 'user', text: 'Hey there!' },
  { sender: 'bot', text: 'Hi! How can I help you today?' },
  { sender: 'user', text: 'What’s the weather like tomorrow?' },
  { sender: 'bot', text: 'It’ll be sunny with a high of 75°F.' },
];

const ChatApp = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Chat UI</h1>
      <ChatBubble messages={dummyMessages} />
    </div>
  );
};

export default ChatApp;
