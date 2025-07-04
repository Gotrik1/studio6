'use server';

import type { GenerateTrainingProgramInput, GenerateTrainingProgramOutput } from './schemas/generate-training-program-schema';

export type { GenerateTrainingProgramInput, GenerateTrainingProgramOutput };

export async function generateTrainingProgram(input: GenerateTrainingProgramInput): Promise<GenerateTrainingProgramOutput> {
  const response = await fetch('/api/ai/generate-training-program', {
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
