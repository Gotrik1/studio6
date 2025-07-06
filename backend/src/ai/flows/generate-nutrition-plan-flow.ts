"use server";
/**
 * @fileOverview An AI agent for generating personalized nutrition plans.
 *
 * - generateNutritionPlan - A function that handles plan generation.
 * - GenerateNutritionPlanInput - The input type for the function.
 * - GenerateNutritionPlanOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GenerateNutritionPlanInputSchema,
  GenerateNutritionPlanOutputSchema,
} from "./schemas/generate-nutrition-plan-schema";
import type {
  GenerateNutritionPlanInput,
  GenerateNutritionPlanOutput,
} from "./schemas/generate-nutrition-plan-schema";

export type { GenerateNutritionPlanInput, GenerateNutritionPlanOutput };

export async function generateNutritionPlan(
  input: GenerateNutritionPlanInput,
): Promise<GenerateNutritionPlanOutput> {
  return generateNutritionPlanFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "generateNutritionPlanPrompt_Backend",
  input: { schema: GenerateNutritionPlanInputSchema },
  output: { schema: GenerateNutritionPlanOutputSchema },
  prompt: `You are an expert nutritionist and dietitian. Your task is to create a personalized nutrition plan based on the user's data. All text must be in Russian.

USER DATA:
- Goal: {{{goal}}}
- Activity Level: {{{activityLevel}}}
{{#if dietaryPreferences}}- Dietary Preferences: {{{dietaryPreferences}}}{{/if}}

INSTRUCTIONS:
1.  **Calculate Daily Needs**: Based on the goal and activity level, estimate the daily calorie needs. For 'Набор массы', add a surplus of 300-500 kcal. For 'Снижение веса', create a deficit of 300-500 kcal.
2.  **Macronutrient Split**: Use a balanced split, e.g., 40% carbs, 30% protein, 30% fat. Adjust as needed for the goal. For mass gain, you can slightly increase carbs.
3.  **Create Meal Plan**: Create a sample one-day meal plan with 3-4 meals (Breakfast, Lunch, Dinner, optional Snack). For each meal, provide a simple, healthy food example and its approximate calorie count.
4.  **Dietary Preferences**: If dietary preferences are provided, ensure the meal plan respects them. For example, for 'вегетарианство', use plant-based protein sources.

The final output MUST be in the specified JSON format.
`,
});

const generateNutritionPlanFlow_Backend = ai.defineFlow(
  {
    name: "generateNutritionPlanFlow_Backend",
    inputSchema: GenerateNutritionPlanInputSchema,
    outputSchema: GenerateNutritionPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
