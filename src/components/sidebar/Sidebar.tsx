"use client";
import React from 'react';
import { ChatSession } from '@/types';
import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import ChatListItem from './ChatListItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
  chatSessions,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  const handleNewChatAndCloseSidebar = () => {
    onNewChat();
    if (window.innerWidth < 768) toggleSidebar(); // Or just setIsSidebarOpen(false)
  }

  const handleSelectChatAndCloseSidebar = (chatId: string) => {
    onSelectChat(chatId);
    if (window.innerWidth < 768) toggleSidebar();
  }

  return (
    <aside className={`bg-neutral-900 flex flex-col transition-all duration-300 ease-in-out border-r border-neutral-800 ${isSidebarOpen ? 'w-64 md:w-72' : 'w-0 md:w-16'} overflow-hidden`}>
      <SidebarHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NewChatButton isSidebarOpen={isSidebarOpen} onNewChat={handleNewChatAndCloseSidebar} />
      <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
        {chatSessions.map((session) => (
          <ChatListItem
            key={session.id}
            session={session}
            currentChatId={currentChatId}
            isSidebarOpen={isSidebarOpen}
            onSelectChat={handleSelectChatAndCloseSidebar}
            onDeleteChat={onDeleteChat}
          />
        ))}
      </nav>
      <div className={`p-4 border-t border-neutral-800 ${isSidebarOpen ? '' : 'hidden'}`}>
        <p className="text-xs text-gray-500">Cortensor Interface v0.5</p>
      </div>
    </aside>
  );
};

export default Sidebar;