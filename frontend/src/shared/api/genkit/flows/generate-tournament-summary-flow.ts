
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally to decouple from backend schemas.
export type TournamentMatchResult = {
    team1: string;
    team2: string;
    score: string;
};

export type GenerateTournamentSummaryInput = {
  tournamentName: string;
  tournamentGame: string;
  finalMatch: TournamentMatchResult;
  champion: string;
};

export type GenerateTournamentSummaryOutput = {
  summaryArticle: string;
  mvp: {
    name: string;
    reason: string;
  };
  socialMediaPost: string;
  imagePrompts: string[];
};

export async function generateTournamentSummary(input: GenerateTournamentSummaryInput): Promise<GenerateTournamentSummaryOutput> {
  const result = await fetchWithAuth<GenerateTournamentSummaryOutput>('/ai/generate-tournament-summary', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!result.success || !result.data) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
