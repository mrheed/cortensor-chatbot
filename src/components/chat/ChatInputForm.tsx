"use client";
import React, { useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputFormProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  inputRef,
}) => {
   useEffect(() => {
    // Check if inputRef exists and its .current property is also available
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    // Add dependencies if you want this effect to re-run based on certain props/state
    // For example, to focus when a certain isLoading state changes.
  }, [inputRef, isLoading]);

  return (
    <footer className="p-3 bg-neutral-900 border-t border-neutral-800">
      <form onSubmit={onSubmit} className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Send a message to Cortensor AI..."
          disabled={isLoading}
          className="flex-grow py-2 px-4 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-100 placeholder-neutral-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150 font-medium"
          aria-label="Send message"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </footer>
  );
};

export default ChatInputForm;