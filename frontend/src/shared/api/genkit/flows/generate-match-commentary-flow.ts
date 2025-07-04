
'use server';
/**
 * @fileOverview An AI agent for generating a play-by-play commentary for a match.
 *
 * - generateMatchCommentary - A function that handles the commentary generation.
 * - GenerateMatchCommentaryInput - The input type for the function.
 * - GenerateMatchCommentaryOutput - The return type for the function.
 */

import { ai } from '@genkit-ai/next';
import { z } from 'zod';
import { GenerateMatchCommentaryInputSchema, GenerateMatchCommentaryOutputSchema } from './schemas/generate-match-commentary-schema';
import type { GenerateMatchCommentaryInput, GenerateMatchCommentaryOutput } from './schemas/generate-match-commentary-schema';
import { textToSpeech } from './tts-flow';

export type { GenerateMatchCommentaryInput, GenerateMatchCommentaryOutput };

export async function generateMatchCommentary(input: GenerateMatchCommentaryInput): Promise<GenerateMatchCommentaryOutput & { audioDataUri: string }> {
  return generateMatchCommentaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMatchCommentaryPrompt',
  input: { schema: GenerateMatchCommentaryInputSchema },
  output: { schema: GenerateMatchCommentaryOutputSchema },
  prompt: `You are an energetic and professional sports commentator. Your task is to create an exciting play-by-play commentary script based on the provided list of key match events.
Make it sound like a real broadcast. Describe the tension and the highlights.

Match: {{{team1Name}}} vs {{{team2Name}}}

Key Events:
{{#each events}}
- {{time}}: {{event}} by {{player}} ({{team}})
{{/each}}

Generate the commentary script now. Be descriptive and engaging.
`,
});

const generateMatchCommentaryFlow = ai.defineFlow(
  {
    name: 'generateMatchCommentaryFlow',
    inputSchema: GenerateMatchCommentaryInputSchema,
    outputSchema: z.object({
        ...GenerateMatchCommentaryOutputSchema.shape,
        audioDataUri: z.string(),
    })
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate commentary script.");
    }
    const { commentaryScript } = output;

    const { audioDataUri } = await textToSpeech(commentaryScript);
    
    return {
        commentaryScript,
        audioDataUri,
    };
  }
);
