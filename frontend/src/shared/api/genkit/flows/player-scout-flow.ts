'use server';

import type { PlayerScoutInput, PlayerScoutOutput } from './schemas/player-scout-schema';

export async function playerScout(input: PlayerScoutInput): Promise<PlayerScoutOutput> {
  const response = await fetch('/api/ai/player-scout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
