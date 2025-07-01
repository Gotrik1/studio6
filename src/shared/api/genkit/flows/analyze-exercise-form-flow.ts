
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
    // In a real application, the 'prompt' call would use a vision-capable model to analyze the video.
    // For this prototype, we will return a mock result to demonstrate the UI flow.
    // The actual prompt is correctly set up for a real implementation.
    console.log(`Analyzing exercise form for: ${input.exerciseName} with video...`);
    
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock response based on the exercise name
    if (input.exerciseName.toLowerCase().includes('приседания')) {
        return {
            overallAssessment: "Техника в целом неплохая, но есть важные моменты для улучшения глубины и стабильности.",
            corrections: [
                { part: "Спина", correction: "Наблюдается небольшой наклон вперед в нижней точке. Старайтесь держать грудь выше и смотреть прямо перед собой." },
                { part: "Глубина", correction: "Присед недостаточно глубокий (таз не опускается ниже коленей). Попробуйте немного уменьшить вес и сосредоточиться на полной амплитуде." },
            ],
            positivePoints: ["Хорошо удерживаете равновесие, стопы плотно прижаты к полу.", "Контролируемое опускание, без резких движений."]
        };
    } else {
         return {
            overallAssessment: "Хорошее начало! Есть несколько ключевых моментов для улучшения безопасности и эффективности.",
            corrections: [
                { part: "Локти", correction: "Локти немного расходятся в стороны. Старайтесь держать их ближе к корпусу для лучшей активации целевых мышц." },
                { part: "Амплитуда", correction: "Движение неполное. Убедитесь, что вы работаете в полном диапазоне для максимальной проработки." },
            ],
            positivePoints: ["Стабильное положение корпуса.", "Плавный, контролируемый темп выполнения."]
        };
    }
  }
);
