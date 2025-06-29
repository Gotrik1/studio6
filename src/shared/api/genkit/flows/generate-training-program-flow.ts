'use server';
/**
 * @fileOverview An AI agent for generating personalized training programs.
 */

import { ai } from '@/shared/api/genkit';
import { GenerateTrainingProgramInputSchema, GenerateTrainingProgramOutputSchema } from './schemas/generate-training-program-schema';
import type { GenerateTrainingProgramInput, GenerateTrainingProgramOutput } from './schemas/generate-training-program-schema';
import { exercisesList } from '@/shared/lib/mock-data/exercises';

export type { GenerateTrainingProgramInput, GenerateTrainingProgramOutput };

export async function generateTrainingProgram(input: GenerateTrainingProgramInput): Promise<GenerateTrainingProgramOutput> {
  return generateTrainingProgramFlow(input);
}

// Prepare a simplified string list of exercises for the prompt context.
const availableExercisesString = exercisesList.map(ex => `- ${ex.name} (Мышцы: ${ex.muscleGroup}, Оборудование: ${ex.equipment})`).join('\n');

const prompt = ai.definePrompt({
  name: 'generateTrainingProgramPrompt',
  input: { schema: GenerateTrainingProgramInputSchema },
  output: { schema: GenerateTrainingProgramOutputSchema },
  system: `You are an expert fitness coach and personal trainer. Your task is to create a personalized weekly training program based on user's parameters.
The response must be in Russian.
- Analyze the user's goal, experience level, available days, gender, and focus area.
- Create a logical weekly split (e.g., Push/Pull/Legs, Upper/Lower, Full Body) that matches the number of days.
- For each training day, select 4-6 appropriate exercises from the provided list. Choose exercises that match the muscle groups for that day.
- Provide a creative name for the program and a short description explaining your choices.
- Structure the output strictly according to the provided schema.

User Parameters:
- Goal: {{{goal}}}
- Experience: {{{experience}}}
- Days per week: {{{daysPerWeek}}}
- Gender: {{{gender}}}
- Focus Area: {{{focus}}}

List of available exercises for you to use:
${availableExercisesString}
`,
});

const generateTrainingProgramFlow = ai.defineFlow(
  {
    name: 'generateTrainingProgramFlow',
    inputSchema: GenerateTrainingProgramInputSchema,
    outputSchema: GenerateTrainingProgramOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate a training program.");
    }
    return output;
  }
);
