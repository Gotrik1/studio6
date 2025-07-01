
'use server';
/**
 * @fileOverview An AI agent for analyzing a user's exercise form from a video.
 *
 * - analyzeExerciseForm - A function that handles the form analysis.
 * - AnalyzeExerciseFormInput - The input type for the function.
 * - AnalyzeExerciseFormOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { AnalyzeExerciseFormInputSchema, AnalyzeExerciseFormOutputSchema } from './schemas/analyze-exercise-form-schema';
import type { AnalyzeExerciseFormInput, AnalyzeExerciseFormOutput } from './schemas/analyze-exercise-form-schema';

export type { AnalyzeExerciseFormInput, AnalyzeExerciseFormOutput };


export async function analyzeExerciseForm(input: AnalyzeExerciseFormInput): Promise<AnalyzeExerciseFormOutput> {
  return analyzeExerciseFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeExerciseFormPrompt',
  input: {schema: AnalyzeExerciseFormInputSchema},
  output: {schema: AnalyzeExerciseFormOutputSchema},
  prompt: `You are an expert personal trainer and biomechanics specialist. Analyze the user's form in the provided video for the exercise: {{{exerciseName}}}.

  Your task is to:
  1. Provide a brief, overall assessment of the form.
  2. Identify specific mistakes in their technique. For each mistake, name the body part or aspect of the form and provide a clear, actionable correction.
  3. Identify 1-2 key things the user is doing correctly to provide positive reinforcement.

  Respond in Russian.

  Here is the video:
  {{media url=videoDataUri}}
  `,
});

const analyzeExerciseFormFlow = ai.defineFlow(
  {
    name: 'analyzeExerciseFormFlow',
    inputSchema: AnalyzeExerciseFormInputSchema,
    outputSchema: AnalyzeExerciseFormOutputSchema,
  },
  async (input) => {
    // In a real implementation with a multimodal model, this would perform actual video analysis.
    // For this prototype, we will return mock data based on the exercise name.
    if (input.exerciseName.toLowerCase().includes('приседания')) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis delay
        return {
            overallAssessment: "Техника в целом неплохая, но есть важные моменты для улучшения глубины и стабильности.",
            corrections: [
                { part: "Спина", correction: "Старайтесь держать спину более прямой, избегайте наклона вперед в нижней точке." },
                { part: "Глубина приседа", correction: "Приседайте глубже, пока таз не окажется на уровне или чуть ниже коленей." },
            ],
            positivePoints: [
                "Хороший контроль на опускании.",
                "Колени не заваливаются внутрь.",
            ]
        };
    }

    // Default mock response
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis delay
    return {
        overallAssessment: "Хорошее начало, но есть над чем поработать для идеальной техники.",
        corrections: [
            { part: "Амплитуда", correction: "Увеличьте диапазон движения для лучшей проработки мышц." },
        ],
        positivePoints: [
            "Стабильное положение корпуса.",
        ]
    };

    // --- This is the code that would run in a real scenario ---
    // const {output} = await prompt(input);
    // return output!;
  }
);
