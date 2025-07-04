'use server';

/**
 * @fileOverview An AI agent for generating a personalized tip on the user's dashboard.
 *
 * - generateDashboardTip - A function that handles the tip generation.
 * - GenerateDashboardTipInput - The input type for the function.
 * - GenerateDashboardTipOutput - The return type for the function.
 */

import { ai } from '../genkit';
import {
  GenerateDashboardTipInputSchema,
  GenerateDashboardTipOutputSchema,
} from './schemas/generate-dashboard-tip-schema';
import type {
  GenerateDashboardTipInput,
  GenerateDashboardTipOutput,
} from './schemas/generate-dashboard-tip-schema';

export type { GenerateDashboardTipInput, GenerateDashboardTipOutput };

export async function generateDashboardTip(
  input: GenerateDashboardTipInput
): Promise<GenerateDashboardTipOutput> {
  return generateDashboardTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDashboardTipPrompt_Backend',
  input: { schema: GenerateDashboardTipInputSchema },
  output: { schema: GenerateDashboardTipOutputSchema },
  prompt: `You are an encouraging and insightful AI sports coach. Your user, {{userName}}, has just logged in. 
  
  Based on their very last activity, give them one short, friendly, and actionable piece of advice or encouragement for today. Address them by name. Keep it to 1-2 sentences. Respond in Russian.

  User's Last Activity: {{{lastActivity}}}
  `,
});

const generateDashboardTipFlow = ai.defineFlow(
  {
    name: 'generateDashboardTipFlow_Backend',
    inputSchema: GenerateDashboardTipInputSchema,
    outputSchema: GenerateDashboardTipOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
