'use server';

/**
 * @fileOverview An AI agent for analyzing a user's request for a role change.
 *
 * - analyzeRoleChange - A function that handles the analysis.
 * - AnalyzeRoleChangeInput - The input type for the function.
 * - AnalyzeRoleChangeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeRoleChangeInputSchema = z.object({
  userName: z.string().describe("The name of the user requesting the role change."),
  currentRole: z.string().describe("The user's current role."),
  requestedRole: z.string().describe("The new role the user is being considered for (e.g., 'Модератор', 'Судья')."),
  activitySummary: z.string().describe("A summary of the user's recent activity, including chat behavior, match reports, and community interactions."),
});
export type AnalyzeRoleChangeInput = z.infer<typeof AnalyzeRoleChangeInputSchema>;

export const AnalyzeRoleChangeOutputSchema = z.object({
  recommendation: z.enum(['approve', 'deny', 'caution']).describe("The AI's recommendation: 'approve' (одобрить), 'deny' (отклонить), or 'caution' (рассмотреть с осторожностью)."),
  reasoning: z.string().describe("A brief explanation for the recommendation, highlighting positive or negative indicators in the user's activity."),
  confidence: z.enum(['high', 'medium', 'low']).describe("The AI's confidence in its recommendation."),
});
export type AnalyzeRoleChangeOutput = z.infer<typeof AnalyzeRoleChangeOutputSchema>;

export async function analyzeRoleChange(input: AnalyzeRoleChangeInput): Promise<AnalyzeRoleChangeOutput> {
  return analyzeRoleChangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRoleChangePrompt',
  input: {schema: AnalyzeRoleChangeInputSchema},
  output: {schema: AnalyzeRoleChangeOutputSchema},
  prompt: `You are an experienced administrator of an esports platform. Your task is to evaluate a user for a promotion to a position of responsibility.

  Analyze the user's activity summary to determine if they are a good fit for the requested role.
  - For 'Модератор' or 'Судья', look for signs of fairness, impartiality, good communication, and knowledge of the rules.
  - Red flags include toxicity, abuse of systems, frequent complaints, or suspicious activity.

  User: {{{userName}}}
  Current Role: {{{currentRole}}}
  Requested Role: {{{requestedRole}}}
  Activity Summary:
  {{{activitySummary}}}

  Provide a clear recommendation ('approve', 'deny', or 'caution'), your reasoning, and a confidence level.
  `,
});

const analyzeRoleChangeFlow = ai.defineFlow(
  {
    name: 'analyzeRoleChangeFlow',
    inputSchema: AnalyzeRoleChangeInputSchema,
    outputSchema: AnalyzeRoleChangeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
