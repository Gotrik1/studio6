'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export type GenerateTeamConceptInput = {
  prompt: string;
};

export type GenerateTeamConceptOutput = {
  name: string;
  motto: string;
  description: string;
  avatarDataUri: string;
};

export async function generateTeamConcept(input: GenerateTeamConceptInput): Promise<GenerateTeamConceptOutput> {
  const result = await fetchWithAuth('/ai/generate-team-concept', {
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
