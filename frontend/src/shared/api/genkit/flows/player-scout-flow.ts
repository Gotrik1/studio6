'use server';

import type { PlayerScoutInput, PlayerScoutOutput } from './schemas/player-scout-schema';
export type { PlayerScoutInput, PlayerScoutOutput };

export async function playerScout(input: PlayerScoutInput): Promise<PlayerScoutOutput> {
  const response = await fetch('/api/ai/player-scout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
