'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getChats() {
  const result = await fetchWithAuth('/chats');
  if (!result.success) {
    console.error("Failed to fetch chats:", result.error);
    return [];
  }
  return result.data;
}
