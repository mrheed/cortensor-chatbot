// src/services/cortensorService.ts
import { ApiRequestBody, ApiSuccessResponse, ApiErrorResponse } from '@/types';

interface FetchChatCompletionParams {
  apiUrl: string;
  body: ApiRequestBody;
}

export const fetchChatCompletion = async ({
  apiUrl,
  body,
}: FetchChatCompletionParams): Promise<ApiSuccessResponse> => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | { message: string };
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'Unknown API error. Failed to parse error response.' };
    }

    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    if (errorData && typeof errorData === 'object') {
      if ('detail' in errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage += ` - ${errorData.detail}`;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0 && errorData.detail[0].msg) {
          errorMessage += ` - ${errorData.detail.map(d => d.msg).join(', ')}`;
        }
      } else if ('message' in errorData && errorData.message) {
        errorMessage += ` - ${errorData.message}`;
      } else if (Object.keys(errorData).length > 0) {
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      }
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // Validate the structure of the successful response
  if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
    return data as ApiSuccessResponse;
  } else {
    console.error('Unexpected API response structure:', data);
    throw new Error('Received an unexpected response structure from the API.');
  }
};