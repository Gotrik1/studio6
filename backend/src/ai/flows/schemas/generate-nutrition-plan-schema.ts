import { z } from "zod";

export const GenerateNutritionPlanInputSchema = z.object({
  goal: z.enum(["Набор массы", "Снижение веса", "Поддержание веса"]),
  activityLevel: z.enum(["Низкий", "Средний", "Высокий"]),
  dietaryPreferences: z.string().optional(),
});
export type GenerateNutritionPlanInput = z.infer<
  typeof GenerateNutritionPlanInputSchema
>;

export const MealSchema = z.object({
  mealName: z.string().describe("Название приема пищи (например, Завтрак)."),
  description: z.string().describe("Пример блюда для этого приема пищи."),
  calories: z.number().describe("Примерное количество калорий."),
});

export const GenerateNutritionPlanOutputSchema = z.object({
  dailyCalories: z.number().describe("Рекомендуемая суточная калорийность."),
  macronutrients: z.object({
    protein: z.number().describe("Рекомендуемое количество белков в граммах."),
    fat: z.number().describe("Рекомендуемое количество жиров в граммах."),
    carbs: z.number().describe("Рекомендуемое количество углеводов в граммах."),
  }),
  mealPlan: z
    .array(MealSchema)
    .describe("Примерный план питания на день, состоящий из 3-4 приемов пищи."),
});
export type GenerateNutritionPlanOutput = z.infer<
  typeof GenerateNutritionPlanOutputSchema
>;
