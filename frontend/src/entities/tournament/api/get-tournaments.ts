
'use server';

import type { Tournament } from '@/entities/tournament/model/types';

export async function fetchTournaments(): Promise<Tournament[]> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/tournaments`, {
      cache: 'no-store', // Disable caching for development
    });

    if (!response.ok) {
      console.error('Failed to fetch tournaments from backend:', response.statusText);
      return []; // Return empty array on failure
    }

    const tournaments = await response.json();
    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    // In a real app, you might want to handle this more gracefully
    // For now, returning an empty array to prevent crashes.
    return [];
  }
}
