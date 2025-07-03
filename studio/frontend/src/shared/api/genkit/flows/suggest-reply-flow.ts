
'use server';

/**
 * @fileOverview An AI agent for suggesting replies in a chat conversation.
 *
 * - suggestReply - A function that suggests chat replies.
 * - SuggestReplyInput - The input type for the suggestReply function.
 * - SuggestReplyOutput - The return type for the suggestReply function.
 */

import {ai} from '@/shared/api/genkit';
import {z} from 'zod';
import { SuggestReplyInputSchema, SuggestReplyOutputSchema } from './schemas/suggest-reply-schema';
import type { SuggestReplyInput, SuggestReplyOutput } from './schemas/suggest-reply-schema';
import { getTeamData } from '@/shared/lib/mock-data/team-data';

export type { SuggestReplyInput, SuggestReplyOutput };


const getTeamInfo = ai.defineTool(
  {
    name: 'getTeamInfo',
    description: 'Gets information about a team, including their schedule and recent match results.',
    inputSchema: z.string().describe("The ID of the team, for example 'dvotovyie-atlety'."),
    outputSchema: z.any(),
  },
  async (teamId) => {
    // In a real app, this would be a database lookup.
    return getTeamData(teamId);
  }
);


export async function suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplyPrompt',
  input: {schema: SuggestReplyInputSchema},
  output: {schema: SuggestReplyOutputSchema},
  tools: [getTeamInfo],
  prompt: `You are an AI chat assistant. Your task is to generate exactly 3 concise and relevant reply suggestions for 'me'.
  The replies should be natural, appropriate for the context, and in Russian.

  If the conversation is about team activities (schedule, stats, matches), use the \`getTeamInfo\` tool with the provided \`teamId\` to get factual data.
  Base your suggestions on this data to provide helpful, informative replies.

  If no \`teamId\` is provided or the conversation is not about team activities, generate general conversational replies.

  Recent Chat History:
  {{{history}}}
  {{#if teamId}}
  Team ID for context: {{{teamId}}}
  {{/if}}
  `,
});

const suggestReplyFlow = ai.defineFlow(
  {
    name: 'suggestReplyFlow',
    inputSchema: SuggestReplyInputSchema,
    outputSchema: SuggestReplyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
