'use server';

import { getSession } from "@/features/auth/session";

export async function getChatHistory(chatId: string) {
  const session = await getSession();
  if (!session?.access_token) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`${process.env.BACKEND_URL}/chats/${chatId}/history`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
}
