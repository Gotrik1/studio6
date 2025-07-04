'use server';

import type { Match } from '@/entities/match/model/types';

export async function fetchMatches(): Promise<Match[]> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/matches`, {
      cache: 'no-store', // Disable caching for development
    });

    if (!response.ok) {
      console.error('Failed to fetch matches from backend:', response.statusText);
      return []; // Return empty array on failure
    }

    const matches = await response.json();
    return matches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    // In a real app, you might want to handle this more gracefully
    // For now, returning an empty array to prevent crashes.
    return [];
  }
}
