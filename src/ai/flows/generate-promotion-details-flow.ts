'use server';

/**
 * @fileOverview An AI agent for generating promotion details.
 *
 * - generatePromotionDetails - A function that handles the generation.
 * - GeneratePromotionDetailsInput - The input type for the function.
 * - GeneratePromotionDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GeneratePromotionDetailsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the promotion idea. e.g., "Скидка на игровые мыши от нашего бренда"'),
});
export type GeneratePromotionDetailsInput = z.infer<typeof GeneratePromotionDetailsInputSchema>;

export const GeneratePromotionDetailsOutputSchema = z.object({
  name: z.string().describe('A creative and catchy name for the promotion or contest.'),
  description: z.string().describe('A short, exciting description for the promotion announcement.'),
  prize: z.string().describe('A description of the prize for the winner(s).'),
});
export type GeneratePromotionDetailsOutput = z.infer<typeof GeneratePromotionDetailsOutputSchema>;

export async function generatePromotionDetails(input: GeneratePromotionDetailsInput): Promise<GeneratePromotionDetailsOutput> {
  return generatePromotionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionDetailsPrompt',
  input: {schema: GeneratePromotionDetailsInputSchema},
  output: {schema: GeneratePromotionDetailsOutputSchema},
  prompt: `You are a creative marketing expert for an esports platform. Based on the following idea, generate a creative name for a promotion/contest, a short description, and a prize description.
  The name, description, and prize should be in Russian.

  Promotion Idea: {{{prompt}}}
  `,
});

const generatePromotionDetailsFlow = ai.defineFlow(
  {
    name: 'generatePromotionDetailsFlow',
    inputSchema: GeneratePromotionDetailsInputSchema,
    outputSchema: GeneratePromotionDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
