
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally
export type GenerateMatchPostInput = {
    winningTeam: string;
    losingTeam: string;
    score: string;
    matchSummary: string;
};

export type GenerateMatchPostOutput = {
  postText: string;
  imageDataUri: string;
};

export async function generateMatchPost(input: GenerateMatchPostInput): Promise<GenerateMatchPostOutput> {
  const result = await fetchWithAuth('/ai/generate-match-post', {
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
