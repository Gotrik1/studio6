'use server';

/**
 * @fileOverview A flow for generating a two-speaker dialogue from a topic.
 * - generateDialogue - A function that handles dialogue generation.
 * - GenerateDialogueInput - The input type for the function.
 * - GenerateDialogueOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateDialogueInputSchema = z.string().describe("The topic for the dialogue.");
export type GenerateDialogueInput = z.infer<typeof GenerateDialogueInputSchema>;

export const GenerateDialogueOutputSchema = z.object({
  dialogue: z.string().describe("A script with two speakers (Speaker1 and Speaker2) in the format 'SpeakerX: text'. Each line should be on a new line."),
});
export type GenerateDialogueOutput = z.infer<typeof GenerateDialogueOutputSchema>;

export async function generateDialogue(topic: GenerateDialogueInput): Promise<GenerateDialogueOutput> {
  return generateDialogueFlow(topic);
}

const prompt = ai.definePrompt({
  name: 'generateDialoguePrompt',
  input: {schema: GenerateDialogueInputSchema},
  output: {schema: GenerateDialogueOutputSchema},
  prompt: `You are a scriptwriter. Generate a short, engaging dialogue between two people, Speaker1 and Speaker2, on the following topic. The dialogue should be about 4-6 lines long in total. Ensure the output format is a single string with each line of dialogue on a new line, like this:
Speaker1: Hello there.
Speaker2: General Kenobi!

Topic: {{{input}}}
`,
});

const generateDialogueFlow = ai.defineFlow(
  {
    name: 'generateDialogueFlow',
    inputSchema: GenerateDialogueInputSchema,
    outputSchema: GenerateDialogueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
