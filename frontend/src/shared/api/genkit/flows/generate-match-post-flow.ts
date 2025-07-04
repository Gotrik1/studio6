'use server';

import type { GenerateMatchPostInput, GenerateMatchPostOutput } from './schemas/generate-match-post-schema';
export type { GenerateMatchPostInput, GenerateMatchPostOutput };


export async function generateMatchPost(input: GenerateMatchPostInput): Promise<GenerateMatchPostOutput> {
  const response = await fetch('/api/ai/generate-match-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
