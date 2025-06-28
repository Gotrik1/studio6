'use server';

/**
 * @fileOverview An AI agent for analyzing a player's request to join a team.
 *
 * - analyzeJoinRequest - A function that handles the analysis.
 * - AnalyzeJoinRequestInput - The input type for the function.
 * - AnalyzeJoinRequestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeJoinRequestInputSchema = z.object({
  teamNeeds: z.string().describe("A summary of the team's current needs, preferred roles, and playstyle."),
  playerProfile: z.string().describe("A summary of the applying player's profile, including their stats, preferred roles, and match history."),
});
export type AnalyzeJoinRequestInput = z.infer<typeof AnalyzeJoinRequestInputSchema>;

export const AnalyzeJoinRequestOutputSchema = z.object({
  recommendation: z.enum(['accept', 'consider', 'decline']).describe("The AI's recommendation on whether to accept the player."),
  reasoning: z.string().describe("A brief explanation for the recommendation, highlighting how the player fits or doesn't fit the team's needs."),
  confidence: z.enum(['high', 'medium', 'low']).describe("The AI's confidence in its recommendation."),
});
export type AnalyzeJoinRequestOutput = z.infer<typeof AnalyzeJoinRequestOutputSchema>;

export async function analyzeJoinRequest(input: AnalyzeJoinRequestInput): Promise<AnalyzeJoinRequestOutput> {
  return analyzeJoinRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJoinRequestPrompt',
  input: {schema: AnalyzeJoinRequestInputSchema},
  output: {schema: AnalyzeJoinRequestOutputSchema},
  prompt: `You are an expert esports team scout and analyst. Your task is to evaluate a player's request to join a team.

  Analyze the player's profile against the team's needs. Provide a clear recommendation (accept, consider, or decline), a confidence level, and your reasoning.

  Team Needs & Playstyle:
  {{{teamNeeds}}}

  Applying Player's Profile:
  {{{playerProfile}}}
  `,
});

const analyzeJoinRequestFlow = ai.defineFlow(
  {
    name: 'analyzeJoinRequestFlow',
    inputSchema: AnalyzeJoinRequestInputSchema,
    outputSchema: AnalyzeJoinRequestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
