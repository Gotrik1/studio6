'use server';

import type { FindCoachesInput, FindCoachesOutput } from './schemas/find-coaches-schema';
export type { FindCoachesInput, FindCoachesOutput };

export async function findCoaches(input: FindCoachesInput): Promise<FindCoachesOutput> {
  const response = await fetch('/api/ai/find-coaches', {
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
