'use server';

import type { Team } from '@/entities/team/model/types';

export async function getTeams(): Promise<Team[]> {
  try {
    const response = await fetch(`/api/teams`, {
      cache: 'no-store', // Disable caching for development
    });

    if (!response.ok) {
      console.error('Failed to fetch teams from backend:', response.statusText);
      return []; // Return empty array on failure
    }

    const teams = await response.json();
    return teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}
