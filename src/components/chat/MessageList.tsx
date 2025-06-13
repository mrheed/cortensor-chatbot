"use client";
import React, { useEffect } from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  useEffect(() => {
    // Check if messagesEndRef and its current property are not null
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  return (
    <main className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;