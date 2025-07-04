'use server';

import type { Challenge } from '@/entities/challenge/model/types';
import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';

type FormValues = Omit<Challenge, 'id' | 'creator' | 'status' | 'opponent' | 'result'>;

export async function getChallenges(filter: 'open' | 'my' | 'history'): Promise<Challenge[]> {
  const result = await fetchWithAuth(`/challenges?filter=${filter}`);
  if (!result.success) return [];
  return result.data;
}

export async function createChallenge(data: FormValues) {
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
