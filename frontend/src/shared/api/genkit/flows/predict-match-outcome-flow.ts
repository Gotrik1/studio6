'use server';

import type { PredictMatchOutcomeInput, PredictMatchOutcomeOutput } from './schemas/predict-match-outcome-schema';

export type { PredictMatchOutcomeInput, PredictMatchOutcomeOutput };

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
