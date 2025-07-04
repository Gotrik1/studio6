'use server';

import type { GenerateNutritionPlanInput, GenerateNutritionPlanOutput } from './schemas/generate-nutrition-plan-schema';

export type { GenerateNutritionPlanInput, GenerateNutritionPlanOutput };

export async function generateNutritionPlan(input: GenerateNutritionPlanInput): Promise<GenerateNutritionPlanOutput> {
  const response = await fetch('/api/ai/generate-nutrition-plan', {
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
