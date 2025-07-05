'use server';

import type { Match } from '@/entities/match/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function fetchMatches(status?: string): Promise<Match[]> {
  const url = status ? `/matches?status=${status}` : '/matches';
  const result = await fetchWithAuth(url);

  if (!result.success) {
    console.error('Failed to fetch matches from backend:', result.error);
    return []; // Return empty array on failure
  }

  return result.data;
}
