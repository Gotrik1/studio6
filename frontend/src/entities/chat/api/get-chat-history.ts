'use server';

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { ChatMessage } from '../model/types';

export async function getChatHistory(chatId: string): Promise<ChatMessage[]> {
  const result = await fetchWithAuth(`/chats/${chatId}/history`);
  
  if (!result.success) {
    console.error("Failed to fetch chat history:", result.error);
    return [];
  }

  return result.data as ChatMessage[];
}
