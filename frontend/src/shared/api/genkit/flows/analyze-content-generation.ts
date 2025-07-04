'use server';

/**
 * @fileOverview AI agent for analyzing existing user-generated content to inform AI content generation.
 *
 * - analyzeContent - A function that handles the content analysis process.
 * - AnalyzeContentInput - The input type for the analyzeContent function.
 * - AnalyzeContentOutput - The return type for the analyzeContent function.
 */

import {ai} from '@genkit-ai/next';
import { AnalyzeContentInputSchema, AnalyzeContentOutputSchema } from './schemas/analyze-content-generation-schema';
import type { AnalyzeContentInput, AnalyzeContentOutput } from './schemas/analyze-content-generation-schema';

export type { AnalyzeContentInput, AnalyzeContentOutput };

export async function analyzeContent(input: AnalyzeContentInput): Promise<AnalyzeContentOutput> {
  return analyzeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContentPrompt',
  input: {schema: AnalyzeContentInputSchema},
  output: {schema: AnalyzeContentOutputSchema},
  prompt: `You are an AI assistant specializing in content analysis and generation.

You will analyze the user-generated content provided and identify its sentiment,
key topics, and suggest improvements for the content or for generating similar content.

Content Type: {{{contentType}}}
Content: {{{content}}}

Analyze the content and provide the following information:

- Sentiment: The overall sentiment of the content (positive, negative, or neutral).
- Key Topics: A list of the key topics discussed in the content.
- Suggested Improvements: Suggestions for improving the content or generating similar content.
`,
});

const analyzeContentFlow = ai.defineFlow(
  {
    name: 'analyzeContentFlow',
    inputSchema: AnalyzeContentInputSchema,
    outputSchema: AnalyzeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
