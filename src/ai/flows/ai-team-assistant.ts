'use server';

/**
 * @fileOverview An AI assistant for providing summaries of team activity and suggesting relevant content.
 *
 * - aiTeamAssistant - A function that handles the AI assistant process.
 * - AiTeamAssistantInput - The input type for the aiTeamAssistant function.
 * - AiTeamAssistantOutput - The return type for the aiTeamAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTeamAssistantInputSchema = z.object({
  teamActivity: z
    .string()
    .describe('A summary of recent team activity and discussions.'),
  teamGoals: z.string().describe('The current goals and objectives of the team.'),
  relevantContent: z
    .string()
    .optional()
    .describe('Any content that might be relevant to the team, such as documents or links.'),
});
export type AiTeamAssistantInput = z.infer<typeof AiTeamAssistantInputSchema>;

const AiTeamAssistantOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the recent team activity.'),
  suggestions: z
    .string()
    .describe('Suggestions for relevant content or actions the team should consider.'),
});
export type AiTeamAssistantOutput = z.infer<typeof AiTeamAssistantOutputSchema>;

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

  Summary:
  {{output "summary"}}

  Suggestions:
  {{output "suggestions"}}`,
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
