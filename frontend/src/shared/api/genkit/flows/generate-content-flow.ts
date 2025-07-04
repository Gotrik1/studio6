
'use server';

/**
 * @fileOverview An AI agent for generating content based on topics and tone.
 *
 * - generateContent - A function that handles the content generation process.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import {ai} from '@genkit-ai/next';
import { GenerateContentInputSchema, GenerateContentOutputSchema } from './schemas/generate-content-schema';
import type { GenerateContentInput, GenerateContentOutput } from './schemas/generate-content-schema';

export type { GenerateContentInput, GenerateContentOutput };

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: {schema: GenerateContentInputSchema},
  output: {schema: GenerateContentOutputSchema},
  prompt: `You are a creative content generator for a sports platform called "ProDvor".
Your task is to generate a {{contentType}} with an {{tone}} tone about the following topic: {{{topic}}}.

Keep the content concise, engaging, and relevant to a sports audience.`,
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
