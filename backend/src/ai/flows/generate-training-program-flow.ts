"use server";
/**
 * @fileOverview An AI agent for generating personalized training programs.
 *
 * - generateTrainingProgram - A function that handles program generation.
 * - GenerateTrainingProgramInput - The input type for the function.
 * - GenerateTrainingProgramOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GenerateTrainingProgramInputSchema,
  GenerateTrainingProgramOutputSchema,
} from "./schemas/generate-training-program-schema";
import type {
  GenerateTrainingProgramInput,
  GenerateTrainingProgramOutput,
} from "./schemas/generate-training-program-schema";
import { PrismaService } from "@/prisma/prisma.service";

const prisma = new PrismaService();

export type { GenerateTrainingProgramInput, GenerateTrainingProgramOutput };

export async function generateTrainingProgram(
  input: GenerateTrainingProgramInput,
): Promise<GenerateTrainingProgramOutput> {
  const exercises = await prisma.exercise.findMany();
  const allExercisesString = exercises
    .map(
      (ex) =>
        `- ${ex.name} (Группа мышц: ${ex.category}, Оборудование: ${ex.equipment})`,
    )
    .join("\n");

  const prompt = ai.definePrompt({
    name: "generateTrainingProgramPrompt_Backend",
    input: { schema: GenerateTrainingProgramInputSchema },
    output: { schema: GenerateTrainingProgramOutputSchema },
    prompt: `Ты — опытный фитнес-тренер и диетолог. Твоя задача — создать персонализированную программу тренировок на неделю на основе данных пользователя.

  ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
  - Цель: {{{goal}}}
  - Уровень: {{{experience}}}
  - Дней в неделю: {{daysPerWeek}}
  - Пол: {{{gender}}}
  {{#if focus}}- Дополнительный фокус: {{{focus}}}{{/if}}

  ТРЕБОВАНИЯ К ПРОГРАММЕ:
  1.  **Название и Описание**: Придумай мотивирующее название и краткое описание для программы.
  2.  **Структура**: Разбей программу на {{daysPerWeek}} тренировочных дней. Для каждого дня придумай название (например, "День 1: Грудь и Трицепс").
  3.  **Упражнения**: Для каждого дня подбери 4-6 упражнений из предоставленного списка. Распределяй упражнения логично, учитывая мышечные группы. Например, не ставь два тяжелых базовых упражнения на одну и ту же группу мышц подряд.
  4.  **Подходы и Повторения**: Укажи количество подходов и повторений для каждого упражнения, соответствующее цели (для силы: 3-5 подходов по 3-6 повторений; для массы: 3-4 по 8-12; для рельефа/похудения: 3-4 по 12-15).
  5.  **Логика**:
      - Учитывай уровень подготовки: новичкам — больше базовых упражнений с собственным весом или в тренажерах, меньше дней; продвинутым — более сложные сплиты и свободные веса.
      - Учитывай пол: для женщин можно сделать больше акцента на ноги и ягодицы, если не указан другой фокус.
      - Учитывай фокус: если пользователь указал фокус, обязательно включи дополнительные упражнения на эту область.

  ДОСТУПНЫЕ УПРАЖНЕНИЯ:
  ${allExercisesString}

  ВАЖНО: Ответ должен быть строго в формате JSON, соответствующем выходной схеме.`,
  });

  const generateTrainingProgramFlow_Backend = ai.defineFlow(
    {
      name: "generateTrainingProgramFlow_Backend",
      inputSchema: GenerateTrainingProgramInputSchema,
      outputSchema: GenerateTrainingProgramOutputSchema,
    },
    async (flowInput) => {
      const { output } = await prompt(flowInput);
      return output!;
    },
  );

  return generateTrainingProgramFlow_Backend(input);
}
