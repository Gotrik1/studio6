'use server';

// Define types locally to decouple from backend schemas.
// In a real project, these might come from a shared package.
export type Team = {
  name: string;
  motto: string;
  logo: string;
  dataAiHint: string;
  rank: number;
  slug: string;
};

export type Venue = {
  id: string;
  name: string;
  address: string;
  surfaceType: string;
  price: string;
  image: string;
  imageHint: string;
};

export type AnalyzeMatchChallengeInput = string;

export type AnalyzeMatchChallengeOutput = {
  suggestedTeams: Team[];
  suggestedVenues: Venue[];
};

export async function analyzeMatchChallenge(input: AnalyzeMatchChallengeInput): Promise<AnalyzeMatchChallengeOutput> {
  const response = await fetch('/api/ai/analyze-match-challenge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
