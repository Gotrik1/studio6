'use server';

/**
 * @fileOverview An AI agent for generating content based on topics and tone.
 *
 * - generateContent - A function that handles the content generation process.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentInputSchema = z.object({
  topic: z.string().describe('The main topic or keywords for the content.'),
  tone: z.string().describe('The desired tone for the content (e.g., enthusiastic, professional, witty).'),
  contentType: z.string().describe('The type of content to generate (e.g., news post, tweet, match summary).'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  generatedText: z.string().describe('The AI-generated content.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: {schema: GenerateContentInputSchema},
  output: {schema: GenerateContentOutputSchema},
  prompt: `You are a creative content generator for an esports platform called "ProDvor".
Your task is to generate a {{contentType}} with an {{tone}} tone about the following topic: {{{topic}}}.

Keep the content concise, engaging, and relevant to a gaming and esports audience.`,
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
