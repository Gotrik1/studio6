'use server';

import type { FindVenuesInput, FindVenuesOutput } from './schemas/find-venues-schema';
export type { FindVenuesInput, FindVenuesOutput };


export async function findVenues(input: FindVenuesInput): Promise<FindVenuesOutput> {
  const response = await fetch('/api/ai/find-venues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
