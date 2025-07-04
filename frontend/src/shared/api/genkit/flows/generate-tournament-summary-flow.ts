'use server';

import type { GenerateTournamentSummaryInput, GenerateTournamentSummaryOutput } from './schemas/generate-tournament-summary-schema';

export type { GenerateTournamentSummaryInput, GenerateTournamentSummaryOutput };

export async function generateTournamentSummary(input: GenerateTournamentSummaryInput): Promise<GenerateTournamentSummaryOutput> {
  const response = await fetch('/api/ai/generate-tournament-summary', {
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
