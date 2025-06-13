// src/types/index.ts

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  timestamp: number;
}

// For the API request payload
export interface ApiRequestBody {
  messages: Pick<Message, 'role' | 'content'>[];
  model: string;
}

// For the expected API success response
export interface ApiSuccessResponse {
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
  }[];
  // Add other fields if your API returns them, e.g., id, object, created, model, usage
}

// For API error responses (example structure)
export interface ApiErrorResponse {
  detail?: string | { msg: string; type: string }[]; // Handling different error structures
  message?: string;
}