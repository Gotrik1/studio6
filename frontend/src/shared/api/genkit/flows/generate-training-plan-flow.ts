'use server';

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
  const response = await fetch('/api/ai/generate-training-plan', {
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
