

'use server';

import type { Match } from '@/entities/match/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function fetchMatches(status?: string, tournamentId?: string, teamId?: string): Promise<Match[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (tournamentId) params.set('tournamentId', tournamentId);
  if (teamId) params.set('teamId', teamId);
  
  const queryString = params.toString();
  const url = `/matches${queryString ? `?${queryString}` : ''}`;
  
  const result = await fetchWithAuth<Match[]>(url);

  if (!result.success) {
    console.error('Failed to fetch matches from backend:', result.error);
    return []; // Return empty array on failure
  }

  return result.data;
}
