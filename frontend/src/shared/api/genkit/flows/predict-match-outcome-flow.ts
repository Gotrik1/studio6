
'use server';

// Define types locally
export type TeamStats = {
  name: string;
  winRate: string;
  recentForm: string;
};

export type PredictMatchOutcomeInput = {
  team1: TeamStats;
  team2: TeamStats;
  headToHead?: string;
  matchContext?: string;
};

export type PredictMatchOutcomeOutput = {
  predictedWinner: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
};

export async function predictMatchOutcome(input: PredictMatchOutcomeInput): Promise<PredictMatchOutcomeOutput> {
  const response = await fetch('/api/ai/predict-match-outcome', {
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
