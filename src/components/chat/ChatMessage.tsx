"use client";
import React from 'react';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl px-4 py-2.5 rounded-xl shadow-md ${
          message.role === 'user'
            ? 'bg-slate-700 text-white rounded-br-none'
            : message.isError
            ? 'bg-red-700 text-red-100 rounded-bl-none border border-red-600'
            : 'bg-neutral-800 text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;