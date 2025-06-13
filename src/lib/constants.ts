// src/lib/constants.ts
import { Message, ChatSession } from '@/types';
import { generateId } from './utils'; // We'll define this next

// Default API URL - User should change this
export const DEFAULT_CORTENSOR_API_URL = 'http://YOUR_ROUTER_IP:YOUR_PORT/api/v1/chat';
// Default Model
export const DEFAULT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.1';

export const initialWelcomeMessage: Message = {
  id: generateId(), // generateId will be available
  role: 'assistant',
  content: 'Welcome! I am your Cortensor AI assistant. Set your API endpoint to begin.',
};

export const createNewChatSession = (name?: string): ChatSession => ({
  id: generateId(),
  name: name || `Chat ${Date.now().toString().slice(-4)}`, // More unique default name
  messages: [initialWelcomeMessage],
  timestamp: Date.now(),
});