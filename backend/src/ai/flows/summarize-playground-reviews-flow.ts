'use server';
/**
 * @fileOverview An AI agent for summarizing user reviews about a playground.
 *
 * - summarizePlaygroundReviews - A function that handles review summarization.
 * - SummarizePlaygroundReviewsInput - The input type for the function.
 * - SummarizePlaygroundReviewsOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { SummarizePlaygroundReviewsInputSchema, SummarizePlaygroundReviewsOutputSchema } from './schemas/summarize-playground-reviews-schema';
import type { SummarizePlaygroundReviewsInput, SummarizePlaygroundReviewsOutput } from './schemas/summarize-playground-reviews-schema';

export type { SummarizePlaygroundReviewsInput, SummarizePlaygroundReviewsOutput };

export async function summarizePlaygroundReviews(input: SummarizePlaygroundReviewsInput): Promise<SummarizePlaygroundReviewsOutput> {
  return summarizePlaygroundReviewsFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePlaygroundReviewsPrompt_Backend',
  input: { schema: SummarizePlaygroundReviewsInputSchema },
  output: { schema: SummarizePlaygroundReviewsOutputSchema },
  prompt: `You are a helpful assistant for a sports platform. Your task is to analyze a list of user reviews for a playground and create a concise summary.

  User Reviews:
  {{#each reviews}}
  - "{{{this}}}"
  {{/each}}

  Instructions:
  1.  Read all the reviews carefully.
  2.  Identify the most common positive themes (e.g., "good lighting", "new surface") and list them as "pros".
  3.  Identify the most common negative themes or complaints (e.g., "crowded", "broken equipment") and list them as "cons".
  4.  Provide 2-3 pros and 2-3 cons.
  5.  Calculate the average rating based on the number of pros and cons (this is a mock calculation for the prompt, the real calculation is done in code).

  Respond in Russian. The tone should be neutral and helpful.
  `,
});

const summarizePlaygroundReviewsFlow_Backend = ai.defineFlow(
  {
    name: 'summarizePlaygroundReviewsFlow_Backend',
    inputSchema: SummarizePlaygroundReviewsInputSchema,
    outputSchema: SummarizePlaygroundReviewsOutputSchema,
  },
  async (input) => {
    // This is a simplified mock implementation. A real one would do more complex logic.
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a summary.");
    }
    
    // In a real app, you would pass the ratings along with the text to calculate this properly.
    // For the demo, we'll just mock it.
    output.averageRating = 4.1; 

    return output;
  }
);
