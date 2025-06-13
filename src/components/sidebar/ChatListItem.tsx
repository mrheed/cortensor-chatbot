"use client";
import React from 'react';
import { MessageCircleIcon, Trash2 } from 'lucide-react';
import { ChatSession } from '@/types';

interface ChatListItemProps {
  session: ChatSession;
  currentChatId: string | null;
  isSidebarOpen: boolean;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  session,
  currentChatId,
  isSidebarOpen,
  onSelectChat,
  onDeleteChat,
}) => {
  return (
    <div key={session.id} className="relative group">
      <button
        onClick={() => onSelectChat(session.id)}
        className={`w-full flex items-center p-2.5 rounded-md text-sm text-left truncate transition-colors duration-150 ${
          currentChatId === session.id ? 'bg-yellow-400 text-black font-semibold' : 'text-gray-300 hover:bg-neutral-700 hover:text-gray-100'
        } ${isSidebarOpen ? 'justify-start' : 'justify-center pr-8'}`}
        title={session.name}
      >
        <MessageCircleIcon size={isSidebarOpen ? 16 : 20} className={isSidebarOpen ? "mr-2.5 flex-shrink-0" : "flex-shrink-0"} />
        {isSidebarOpen && <span className="truncate">{session.name}</span>}
      </button>
      {isSidebarOpen && (
        <button
          onClick={(e) => onDeleteChat(session.id, e)}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-neutral-700 hover:text-red-500 hover:bg-[rgba(0,0,0,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
          title="Delete chat"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default ChatListItem;