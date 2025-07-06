'use server';

import type { GenerateNutritionPlanInput, GenerateNutritionPlanOutput } from './schemas/generate-nutrition-plan-schema';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type { GenerateNutritionPlanInput, GenerateNutritionPlanOutput };

export async function generateNutritionPlan(input: GenerateNutritionPlanInput): Promise<GenerateNutritionPlanOutput> {
  const result = await fetchWithAuth('/ai/generate-nutrition-plan', {
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
