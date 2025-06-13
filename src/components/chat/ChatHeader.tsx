"use client";
import React from 'react';
import { MessageSquare, Menu, X } from 'lucide-react';
import { ChatSession } from '@/types';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  currentChatId: string | null;
  chatSessions: ChatSession[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isSidebarOpen, toggleSidebar, currentChatId, chatSessions }) => {
  const currentSessionName = chatSessions.find(s => s.id === currentChatId)?.name || "Cortensor AI";

  return (
    <header className="bg-neutral-900 h-16 shadow-sm flex items-center justify-between px-4 border-b border-neutral-800">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-1 mr-3 rounded-md text-gray-400 hover:text-gray-100 hover:bg-neutral-700 hidden md:block">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <MessageSquare size={22} className="text-yellow-400 mr-2" />
        <h1 className="text-lg font-semibold text-gray-100">
          {currentSessionName}
        </h1>
      </div>
    </header>
  );
};

export default ChatHeader;