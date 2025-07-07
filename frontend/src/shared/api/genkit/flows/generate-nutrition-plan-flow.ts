
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally
export type GenerateNutritionPlanInput = {
  goal: 'Набор массы' | 'Снижение веса' | 'Поддержание веса';
  activityLevel: 'Низкий' | 'Средний' | 'Высокий';
  dietaryPreferences?: string;
};

export type Meal = {
  mealName: string;
  description: string;
  calories: number;
};

export type GenerateNutritionPlanOutput = {
  dailyCalories: number;
  macronutrients: {
    protein: number;
    fat: number;
    carbs: number;
  };
  mealPlan: Meal[];
};

export async function generateNutritionPlan(input: GenerateNutritionPlanInput): Promise<GenerateNutritionPlanOutput> {
  const result = await fetchWithAuth<GenerateNutritionPlanOutput>('/ai/generate-nutrition-plan', {
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
