
'use server';

import type { Challenge } from '@/entities/challenge/model/types';
import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';

// This DTO now accurately reflects the data sent to the backend.
export type CreateChallengeData = {
    title: string;
    description: string;
    disciplineId: string;
    wager: number;
};

export async function getChallenges(filter: 'open' | 'my' | 'history'): Promise<Challenge[]> {
  const result = await fetchWithAuth<Challenge[]>(`/challenges?filter=${filter}`);
  if (!result.success || !result.data) return [];
  return result.data;
}

export async function createChallenge(data: CreateChallengeData) {
  const result = await fetchWithAuth('/challenges', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  revalidatePath('/challenges');
  return result.data;
}

export async function acceptChallenge(challengeId: string) {
  const result = await fetchWithAuth(`/challenges/${challengeId}/accept`, {
    method: 'POST',
  });
   if (!result.success) {
    throw new Error(result.error);
  }
  revalidatePath('/challenges');
  return result.data;
}
