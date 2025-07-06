'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Types are defined here to decouple from backend schemas.
export type ExerciseDetail = {
    name: string;
    sets: string;
    reps: string;
    plannedWeight?: string;
    isSupersetWithPrevious?: boolean;
    technique?: string;
};

export type WorkoutDay = {
    day: number;
    title: string;
    exercises: ExerciseDetail[];
};

export type GenerateTrainingProgramInput = {
  goal: 'Набор массы' | 'Снижение веса' | 'Рельеф' | 'Сила';
  experience: 'Новичок' | 'Средний' | 'Продвинутый';
  daysPerWeek: number;
  gender: 'Мужской' | 'Женский';
  focus?: string;
};

export type GenerateTrainingProgramOutput = {
  name: string;
  description: string;
  weeklySplit: WorkoutDay[];
};

export async function generateTrainingProgram(input: GenerateTrainingProgramInput): Promise<GenerateTrainingProgramOutput> {
  const result = await fetchWithAuth('/ai/generate-training-program', {
    method: 'POST',
    body: JSON.stringify(input),
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
