'use server';

/**
 * @fileOverview An AI agent for analyzing user reports and suggesting moderation actions.
 *
 * - analyzeReport - A function that handles the report analysis.
 * - AnalyzeReportInput - The input type for the function.
 * - AnalyzeReportOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { AnalyzeReportInputSchema, AnalyzeReportOutputSchema } from './schemas/analyze-report-schema';
import type { AnalyzeReportInput, AnalyzeReportOutput } from './schemas/analyze-report-schema';

export type { AnalyzeReportInput, AnalyzeReportOutput };

export async function analyzeReport(input: AnalyzeReportInput): Promise<AnalyzeReportOutput> {
  return analyzeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReportPrompt',
  input: {schema: AnalyzeReportInputSchema},
  output: {schema: AnalyzeReportOutputSchema},
  prompt: `You are an expert, impartial platform moderator with years of experience. Your task is to analyze a user report and recommend a fair course of action.

  Analyze the following information:
  - Reason for Report: {{{reportReason}}}
  - Evidence / Context: {{{evidenceContext}}}
  - Reported User's Historical Activity: {{{reportedUserActivity}}}

  Based on the severity of the violation, the provided evidence, and the user's history, provide a clear recommendation.
  - 'warning' for minor first-time offenses.
  - 'temp_ban' for repeated offenses or moderate violations like cheating accusations with some evidence.
  - 'perm_ban' for severe violations like hate speech, clear evidence of cheating, or spamming phishing links.
  - 'no_action' if the evidence is insufficient or the report is unfounded.

  Provide your reasoning and a confidence level (high, medium, or low) in your decision.
  `,
});

const analyzeReportFlow = ai.defineFlow(
  {
    name: 'analyzeReportFlow',
    inputSchema: AnalyzeReportInputSchema,
    outputSchema: AnalyzeReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
