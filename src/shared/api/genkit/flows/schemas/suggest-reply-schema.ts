import { z } from 'zod';

export const SuggestReplyInputSchema = z.object({
  history: z
    .string()
    .describe('The recent history of the chat conversation.'),
});
export type SuggestReplyInput = z.infer<typeof SuggestReplyInputSchema>;

export const SuggestReplyOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of 3 concise and contextually relevant reply suggestions.'),
});
export type SuggestReplyOutput = z.infer<typeof SuggestReplyOutputSchema>;
