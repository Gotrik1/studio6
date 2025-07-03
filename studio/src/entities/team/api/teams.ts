'use server';

import type { Team } from '@/entities/team/model/types';

export async function fetchTeams(): Promise<Team[]> {
  try {
    // This now fetches from our NestJS backend API
    const response = await fetch('http://localhost:3001/teams', {
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
    // In a real app, you might want to handle this more gracefully
    // For now, returning an empty array to prevent crashes.
    return [];
  }
}
