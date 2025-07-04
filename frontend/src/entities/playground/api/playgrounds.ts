'use server';

import type { Playground } from '@/entities/playground/model/types';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/features/auth/session';

type CreatePlaygroundData = Omit<Playground, 'id' | 'rating' | 'checkIns' | 'status' | 'creator'>;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSession();
  if (!session?.access_token) {
    throw new Error('Unauthorized');
  }
  return fetch(`${process.env.BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
}

export async function getPlaygrounds(): Promise<Playground[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/playgrounds`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch playgrounds');
    return res.json();
  } catch (error) {
    console.error('getPlaygrounds error:', error);
    return [];
  }
}

export async function getPlaygroundById(id: string): Promise<Playground | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/playgrounds/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch playground ${id}`);
    return res.json();
  } catch (error) {
    console.error(`getPlaygroundById error for id ${id}:`, error);
    return null;
  }
}

export async function createPlayground(data: CreatePlaygroundData) {
    try {
        const response = await fetchWithAuth('/playgrounds', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Failed to create playground' };
        }

        revalidatePath('/playgrounds');
        return { success: true, data: await response.json() };
    } catch (error) {
        console.error('Error creating playground:', error);
        return { success: false, error: 'Server error' };
    }
}
