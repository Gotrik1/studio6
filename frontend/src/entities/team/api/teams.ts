'use server';

import type { Team } from '@/entities/team/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getTeams(): Promise<Team[]> {
  const result = await fetchWithAuth('/teams');
  if (!result.success) {
    console.error('Failed to fetch teams from backend:', result.error);
    return []; // Return empty array on failure
  }
  return result.data;
}
