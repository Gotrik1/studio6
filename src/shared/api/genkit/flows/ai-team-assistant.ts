'use server';

/**
 * @fileOverview An AI assistant for providing summaries of team activity and suggesting relevant content.
 *
 * - aiTeamAssistant - A function that handles the AI assistant process.
 * - AiTeamAssistantInput - The input type for the aiTeamAssistant function.
 * - AiTeamAssistantOutput - The return type for the aiTeamAssistant function.
 */

import {ai} from '@/shared/api/genkit';
import { AiTeamAssistantInputSchema, AiTeamAssistantOutputSchema } from './schemas/ai-team-assistant-schema';
import type { AiTeamAssistantInput, AiTeamAssistantOutput } from './schemas/ai-team-assistant-schema';

export type { AiTeamAssistantInput, AiTeamAssistantOutput };

export async function aiTeamAssistant(input: AiTeamAssistantInput): Promise<AiTeamAssistantOutput> {
  return aiTeamAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTeamAssistantPrompt',
  input: {schema: AiTeamAssistantInputSchema},
  output: {schema: AiTeamAssistantOutputSchema},
  prompt: `You are an AI assistant helping a team coordinate and stay informed.

  Based on the provided information, provide a summary of recent team activity and suggest relevant content or actions for the team to consider.

  Team Goals: {{{teamGoals}}}
  Team Activity: {{{teamActivity}}}
  Relevant Content: {{{relevantContent}}}

  Please generate a concise summary and actionable suggestions based on the data.
  `,
});

const aiTeamAssistantFlow = ai.defineFlow(
  {
    name: 'aiTeamAssistantFlow',
    inputSchema: AiTeamAssistantInputSchema,
    outputSchema: AiTeamAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
