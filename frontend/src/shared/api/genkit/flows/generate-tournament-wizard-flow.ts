'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally to decouple from backend schemas.
export type GenerateTournamentWizardInput = {
  prompt: string;
};

export type GenerateTournamentWizardOutput = {
  name: string;
  description: string;
  game: string;
  type: 'team' | 'individual';
  format: 'single_elimination' | 'round_robin' | 'groups';
  imageDataUri: string;
  prizePool: string;
  registrationEndDate: string;
  tournamentStartDate: string;
};


export async function generateTournamentWizard(input: GenerateTournamentWizardInput): Promise<GenerateTournamentWizardOutput> {
  const result = await fetchWithAuth('/ai/generate-tournament-wizard', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  
  if (!result.success) {
    console.error("Backend API error:", result.error);
    throw new Error(result.error || `Backend API responded with status: ${result.status}`);
  }

  if (!result.data) {
    throw new Error("No data received from backend.");
  }
  
  return result.data;
}
