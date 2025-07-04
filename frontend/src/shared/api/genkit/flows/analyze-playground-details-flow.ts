'use server';

import type { AnalyzePlaygroundDetailsInput, AnalyzePlaygroundDetailsOutput } from './schemas/analyze-playground-details-schema';

export type { AnalyzePlaygroundDetailsInput, AnalyzePlaygroundDetailsOutput };

export async function analyzePlaygroundDetails(input: AnalyzePlaygroundDetailsInput): Promise<AnalyzePlaygroundDetailsOutput> {
  const response = await fetch('/api/ai/analyze-playground-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Backend API error:', errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
