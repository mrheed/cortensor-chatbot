"use client"; // Required for client-side hooks and event handlers

import React, { useState, useEffect } from 'react';
import { useChat, UseChatReturn } from '@/hooks/useChat';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ApiConfigForm from '@/components/chat/ApiConfigForm';
import MessageList from '@/components/chat/MessageList';
import StatusBanners from '@/components/chat/StatusBanners';
import ChatInputForm from '@/components/chat/ChatInputForm';

export default function ChatPage() {
  const {
    chatSessions,
    currentChatId,
    currentMessages,
    inputValue,
    isLoading,
    error,
    cortensorApiUrl,
    // model, // if you add model selection UI
    inputRef,
    messagesEndRef,
    handleInputChange,
    handleApiUrlChange,
    // handleModelChange, // if you add model selection UI
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleSubmit,
  }: UseChatReturn = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Effect to handle sidebar visibility on window resize (optional UX improvement)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // Call on initial mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNewChatAndToggle = () => {
    handleNewChat();
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

  const handleSelectChatAndToggle = (chatId: string) => {
    handleSelectChat(chatId);
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }


  if (!currentChatId && chatSessions.length === 0) {
    // This case should ideally be handled within useChat by always ensuring a session exists
    return (
        <div className="flex h-screen bg-neutral-950 text-gray-200 justify-center items-center">
            <p>Loading chat...</p>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-gray-200 font-sans antialiased">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={handleNewChatAndToggle}
        onSelectChat={handleSelectChatAndToggle}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col bg-neutral-950">
        <ChatHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            currentChatId={currentChatId}
            chatSessions={chatSessions}
        />
        <ApiConfigForm
          cortensorApiUrl={cortensorApiUrl}
          onApiUrlChange={handleApiUrlChange}
          // onModelChange={handleModelChange} // If you add model selection
        />
        <MessageList
          messages={currentMessages}
          messagesEndRef={messagesEndRef}
        />
        <StatusBanners isLoading={isLoading} error={error} />
        <ChatInputForm
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}