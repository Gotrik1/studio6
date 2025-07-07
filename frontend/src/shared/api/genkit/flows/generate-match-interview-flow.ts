'use server';

import { fetchWithAuth } from "@/shared/lib/api-client";

export type GenerateMatchInterviewInput = {
  matchSummary: string;
  mvpName: string;
};

export type GenerateMatchInterviewOutput = {
  audioDataUri: string;
  script: string;
};


export async function generateMatchInterview(input: GenerateMatchInterviewInput): Promise<GenerateMatchInterviewOutput> {
  const result = await fetchWithAuth<GenerateMatchInterviewOutput>('/ai/generate-match-interview', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!result.success) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
