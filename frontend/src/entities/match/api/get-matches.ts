'use server';

import type { Match } from '@/entities/match/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function fetchMatches(status?: string, tournamentId?: string): Promise<Match[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (tournamentId) params.set('tournamentId', tournamentId);
  
  const queryString = params.toString();
  const url = `/matches${queryString ? `?${queryString}` : ''}`;
  
  const result = await fetchWithAuth(url);

  if (!result.success) {
    console.error('Failed to fetch matches from backend:', result.error);
    return []; // Return empty array on failure
  }

  return result.data;
}
