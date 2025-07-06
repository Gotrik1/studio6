'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally to decouple from backend schemas.
export type GenerateSportSummaryInput = {
  sportName: string;
};

export type GenerateSportSummaryOutput = {
  summary: string;
  funFact: string;
};

export async function generateSportSummary(input: GenerateSportSummaryInput): Promise<GenerateSportSummaryOutput> {
  const result = await fetchWithAuth('/ai/generate-sport-summary', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (!result.success) {
    console.error("Backend API error:", result.error);
    throw new Error(result.error || 'Failed to generate sport summary.');
  }

  return result.data;
}
