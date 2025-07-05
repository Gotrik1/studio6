'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { ChatContact } from '../model/types';

export async function getChats(): Promise<ChatContact[]> {
  const result = await fetchWithAuth('/chats');
  if (!result.success) {
    console.error("Failed to fetch chats:", result.error);
    return [];
  }
  return result.data as ChatContact[];
}
