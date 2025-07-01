
'use server';

/**
 * @fileOverview An AI agent for suggesting replies in a chat conversation.
 *
 * - suggestReply - A function that suggests chat replies.
 * - SuggestReplyInput - The input type for the suggestReply function.
 * - SuggestReplyOutput - The return type for the suggestReply function.
 */

import {ai} from '@/shared/api/genkit';
import { SuggestReplyInputSchema, SuggestReplyOutputSchema } from './schemas/suggest-reply-schema';
import type { SuggestReplyInput, SuggestReplyOutput } from './schemas/suggest-reply-schema';

export type { SuggestReplyInput, SuggestReplyOutput };


export async function suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplyPrompt',
  input: {schema: SuggestReplyInputSchema},
  output: {schema: SuggestReplyOutputSchema},
  prompt: `You are an AI chat assistant. Based on the following chat history between 'me' and 'other', generate exactly 3 concise and relevant reply suggestions for 'me'. The replies should be natural and appropriate for the context.

  Recent Chat History:
  {{{history}}}
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
