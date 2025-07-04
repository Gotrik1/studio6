'use server';

import type { GenerateSportSummaryInput, GenerateSportSummaryOutput } from './schemas/generate-sport-summary-schema';

export type { GenerateSportSummaryInput, GenerateSportSummaryOutput };

export async function generateSportSummary(input: GenerateSportSummaryInput): Promise<GenerateSportSummaryOutput> {
  const response = await fetch('/api/ai/generate-sport-summary', {
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

  const result = await response.json();
  return result;
}
