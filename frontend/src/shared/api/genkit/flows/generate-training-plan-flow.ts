
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { AnalyzePlayerPerformanceOutput } from './analyze-player-performance-flow';

// Define types locally
export type GenerateTrainingPlanInput = {
    analysis: AnalyzePlayerPerformanceOutput,
    fitnessGoal: string;
};

export type GenerateTrainingPlanOutput = {
    weeklyFocus: string;
    drills: {
        name: string;
        duration: string;
        description: string;
    }[];
    suggestedVideos: {
        title: string;
        url: string;
    }[];
    weeklyGoal: string;
};

export async function generateTrainingPlan(input: GenerateTrainingPlanInput): Promise<GenerateTrainingPlanOutput> {
  const result = await fetchWithAuth<GenerateTrainingPlanOutput>('/ai/generate-training-plan', {
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
