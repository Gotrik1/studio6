
'use server';

/**
 * @fileOverview An AI agent for analyzing user reports and suggesting moderation actions.
 *
 * - analyzeReport - A function that handles the report analysis.
 * - AnalyzeReportInput - The input type for the function.
 * - AnalyzeReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeReportInputSchema = z.object({
  reportReason: z.string().describe("The reason for the report as stated by the reporting user."),
  evidenceContext: z.string().describe("The context or evidence provided, such as chat logs or a description of events."),
  reportedUserActivity: z.string().describe("A summary of the reported user's recent activity and history on the platform."),
});
export type AnalyzeReportInput = z.infer<typeof AnalyzeReportInputSchema>;

export const AnalyzeReportOutputSchema = z.object({
  recommendation: z.enum(['warning', 'temp_ban', 'perm_ban', 'no_action']).describe("The AI's recommended action: 'warning' (предупреждение), 'temp_ban' (временный бан), 'perm_ban' (постоянный бан), or 'no_action' (нет нарушений)."),
  reasoning: z.string().describe("A brief explanation for the recommendation, highlighting the key factors from the evidence and user's history."),
  confidence: z.enum(['high', 'medium', 'low']).describe("The AI's confidence in its recommendation."),
});
export type AnalyzeReportOutput = z.infer<typeof AnalyzeReportOutputSchema>;

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
