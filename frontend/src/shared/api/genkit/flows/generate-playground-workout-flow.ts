'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export type GeneratePlaygroundWorkoutInput = {
  playgroundType: string;
  equipment: string[];
};

export type WorkoutExercise = {
    name: string;
    sets: string;
    reps: string;
};

export type GeneratePlaygroundWorkoutOutput = {
  title: string;
  description: string;
  exercises: WorkoutExercise[];
};

export async function generatePlaygroundWorkout(input: GeneratePlaygroundWorkoutInput): Promise<GeneratePlaygroundWorkoutOutput> {
  const result = await fetchWithAuth<GeneratePlaygroundWorkoutOutput>('/ai/generate-playground-workout', {
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
