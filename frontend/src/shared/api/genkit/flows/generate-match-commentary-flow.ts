'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

type Event = {
    time: string;
    event: string;
    player: string;
    team: string;
};

export type GenerateMatchCommentaryInput = {
  team1Name: string;
  team2Name: string;
  events: Event[];
};

export type GenerateMatchCommentaryOutput = {
  commentaryScript: string;
  audioDataUri: string;
};

export async function generateMatchCommentary(input: GenerateMatchCommentaryInput): Promise<GenerateMatchCommentaryOutput> {
  const result = await fetchWithAuth('/ai/generate-match-commentary', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!result.success) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
