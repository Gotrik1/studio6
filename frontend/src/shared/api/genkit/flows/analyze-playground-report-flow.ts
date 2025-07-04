'use server';
/**
 * @fileOverview An AI agent for analyzing user reports about playground conditions.
 *
 * - analyzePlaygroundReport - A function that handles the report analysis.
 * - AnalyzePlaygroundReportInput - The input type for the function.
 * - AnalyzePlaygroundReportOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { AnalyzePlaygroundReportInputSchema, AnalyzePlaygroundReportOutputSchema } from './schemas/analyze-playground-report-schema';
import type { AnalyzePlaygroundReportInput, AnalyzePlaygroundReportOutput } from './schemas/analyze-playground-report-schema';

export type { AnalyzePlaygroundReportInput, AnalyzePlaygroundReportOutput };

export async function analyzePlaygroundReport(input: AnalyzePlaygroundReportInput): Promise<AnalyzePlaygroundReportOutput> {
  return analyzePlaygroundReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlaygroundReportPrompt',
  input: { schema: AnalyzePlaygroundReportInputSchema },
  output: { schema: AnalyzePlaygroundReportOutputSchema },
  prompt: `You are a facilities manager for a sports platform. A user has reported an issue with a playground.
  
  Playground: {{{playgroundName}}}
  Issue Category: {{{issueCategory}}}
  User Comment: "{{{userComment}}}"

  Instructions:
  1.  **Assess Severity**: Based on the category and comment, determine the severity. 'high' for safety risks (e.g., broken glass, major equipment failure), 'medium' for significant functional issues (e.g., broken hoop, large cracks), 'low' for minor issues (e.g., graffiti, worn-out net).
  2.  **Create Summary**: Write a very short, clear summary of the problem to warn other players. e.g., "Баскетбольное кольцо сломано" or "На покрытии есть трещины".
  3.  **Suggest Action**: Recommend a next step for the platform moderators. e.g., "Отправить волонтера для проверки" or "Временно пометить площадку как небезопасную".

  Respond in Russian.
  `,
});

const analyzePlaygroundReportFlow = ai.defineFlow(
  {
    name: 'analyzePlaygroundReportFlow',
    inputSchema: AnalyzePlaygroundReportInputSchema,
    outputSchema: AnalyzePlaygroundReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to analyze the report.");
    }
    return output;
  }
);
