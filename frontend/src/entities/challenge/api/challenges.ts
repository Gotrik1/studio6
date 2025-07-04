'use server';

import type { Challenge } from '@/entities/challenge/model/types';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/features/auth/session';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSession();
  if (!session?.access_token) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`${process.env.BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error on ${url}:`, response.status, errorBody);
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getChallenges(filter: 'open' | 'my' | 'history'): Promise<Challenge[]> {
  return fetchWithAuth(`/challenges?filter=${filter}`);
}

export async function createChallenge(data: Omit<Challenge, 'id' | 'creator' | 'status'>) {
  const result = await fetchWithAuth('/challenges', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath('/challenges');
  return result;
}

export async function acceptChallenge(challengeId: string) {
  const result = await fetchWithAuth(`/challenges/${challengeId}/accept`, {
    method: 'POST',
  });
  revalidatePath('/challenges');
  return result;
}
