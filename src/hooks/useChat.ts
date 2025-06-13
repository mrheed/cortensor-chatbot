// src/hooks/useChat.ts
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatSession, Message, ApiRequestBody } from '@/types';
import {
  DEFAULT_CORTENSOR_API_URL,
  DEFAULT_MODEL,
  createNewChatSession,
  initialWelcomeMessage
} from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { fetchChatCompletion } from '@/services/cortensorService';

export interface UseChatReturn {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  currentMessages: Message[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  cortensorApiUrl: string;
  model: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApiUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleModelChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void; // For future model selection
  handleNewChat: () => string; // Returns new chat ID
  handleSelectChat: (chatId: string) => void;
  handleDeleteChat: (chatIdToDelete: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setCortensorApiUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const useChat = (): UseChatReturn => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    // Lazy initialization: load from localStorage or create new
    // For simplicity, we'll start fresh or with one session.
    // In a real app, you'd persist/retrieve this.
    const initialSession = createNewChatSession('Chat 1');
    return [initialSession];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatSessions[0]?.id || null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cortensorApiUrl, setCortensorApiUrl] = useState(DEFAULT_CORTENSOR_API_URL);
  const [model, setModel] = useState(DEFAULT_MODEL);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentMessages = chatSessions.find(session => session.id === currentChatId)?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChatId, isLoading]); // Also focus after loading stops

  // Ensure chat sessions are always sorted by timestamp (most recent first)
  // This effect runs once on mount if chatSessions are loaded from storage,
  // and also ensures sorting if initial state wasn't sorted.
  useEffect(() => {
    setChatSessions(prevSessions => [...prevSessions].sort((a, b) => b.timestamp - a.timestamp));
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setCortensorApiUrl(e.target.value);
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setModel(e.target.value);

  const handleNewChat = useCallback(() => {
    const newSessionName = `Chat ${chatSessions.length + 1}`;
    const newSession = createNewChatSession(newSessionName);
    setChatSessions(prevSessions => [newSession, ...prevSessions].sort((a,b) => b.timestamp - a.timestamp));
    setCurrentChatId(newSession.id);
    setInputValue('');
    setError(null);
    return newSession.id;
  }, [chatSessions.length]);

  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setError(null);
  }, []);

  const handleDeleteChat = useCallback((chatIdToDelete: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setChatSessions(prevSessions => {
      let remainingSessions = prevSessions.filter(session => session.id !== chatIdToDelete);
      
      if (currentChatId === chatIdToDelete) {
        if (remainingSessions.length > 0) {
          const sortedRemaining = [...remainingSessions].sort((a,b) => b.timestamp - a.timestamp);
          setCurrentChatId(sortedRemaining[0].id);
        } else {
          const newSession = createNewChatSession('Chat 1');
          remainingSessions = [newSession];
          setCurrentChatId(newSession.id);
        }
      }
      // Ensure there's always at least one chat
      return remainingSessions.length > 0 ? remainingSessions : [createNewChatSession('Chat 1')];
    });
  }, [currentChatId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentChatId) return;

    const userMessage: Message = { id: generateId(), role: 'user', content: inputValue.trim() };

    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentChatId
          ? { ...session, messages: [...session.messages, userMessage], timestamp: Date.now() }
          : session
      ).sort((a, b) => b.timestamp - a.timestamp)
    );

    setInputValue('');
    setIsLoading(true);
    setError(null);

    const currentSession = chatSessions.find(s => s.id === currentChatId);
    const messagesForApi: Pick<Message, 'role' | 'content'>[] =
        currentSession
            ? [...currentSession.messages, userMessage] // Add user message for context for API
                .filter(msg => msg.id !== initialWelcomeMessage.id) // Don't send initial welcome message to API
                .map(({ role, content }) => ({ role, content }))
            : [{ role: userMessage.role, content: userMessage.content }];


    try {
      if (!cortensorApiUrl || cortensorApiUrl === DEFAULT_CORTENSOR_API_URL || !cortensorApiUrl.startsWith('http')) {
        throw new Error('Please set a valid Cortensor API endpoint (e.g., http://localhost:8080/api/v1/chat).');
      }

      const requestBody: ApiRequestBody = { messages: messagesForApi, model };
      const data = await fetchChatCompletion({ apiUrl: cortensorApiUrl, body: requestBody });

      const botMessageContent = data.choices[0].message.content.trim();
      const botMessage: Message = { id: generateId(), role: 'assistant', content: botMessageContent };

      setChatSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentChatId
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      );
    } catch (err: any) {
      console.error('Error fetching bot response:', err);
      const errorMessage = err.message || 'Failed to connect to the AI.';
      setError(errorMessage);
      setChatSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentChatId
            ? { ...session, messages: [...session.messages, { id: generateId(), role: 'assistant', content: `Error: ${errorMessage}`, isError: true }] }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    chatSessions,
    currentChatId,
    currentMessages,
    inputValue,
    isLoading,
    error,
    cortensorApiUrl,
    model,
    inputRef,
    messagesEndRef,
    handleInputChange,
    handleApiUrlChange,
    handleModelChange,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleSubmit,
    setCortensorApiUrl,
  };
};