'use server';

/**
 * @fileOverview A flow for generating a post-match audio interview.
 * - generateMatchInterview - A function that handles interview generation.
 * - GenerateMatchInterviewInput - The input type for the function.
 * - GenerateMatchInterviewOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateDialogue } from './dialogue-generation-flow';
import { multiSpeakerTts } from './multi-speaker-tts-flow';

export const GenerateMatchInterviewInputSchema = z.object({
  matchSummary: z.string().describe("A summary of the match."),
  mvpName: z.string().describe("The name of the Most Valuable Player."),
});
export type GenerateMatchInterviewInput = z.infer<typeof GenerateMatchInterviewInputSchema>;

export const GenerateMatchInterviewOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio interview as a data URI in WAV format."),
  script: z.string().describe("The script of the interview."),
});
export type GenerateMatchInterviewOutput = z.infer<typeof GenerateMatchInterviewOutputSchema>;


export async function generateMatchInterview(input: GenerateMatchInterviewInput): Promise<GenerateMatchInterviewOutput> {
  return generateMatchInterviewFlow(input);
}


const generateMatchInterviewFlow = ai.defineFlow(
  {
    name: 'generateMatchInterviewFlow',
    inputSchema: GenerateMatchInterviewInputSchema,
    outputSchema: GenerateMatchInterviewOutputSchema,
  },
  async ({ matchSummary, mvpName }) => {
    // Generate the dialogue script first.
    // The dialogue flow is designed to create a two-speaker dialogue.
    const dialogueTopic = `A short post-match interview between a commentator (Speaker1) and the MVP, ${mvpName} (Speaker2). The commentator asks about a key moment from the match. Use this summary for context: ${matchSummary}`;
    
    const { dialogue } = await generateDialogue(dialogueTopic);

    // Now, generate the multi-speaker audio from the script.
    const { audioDataUri } = await multiSpeakerTts(dialogue);

    return {
      audioDataUri,
      script: dialogue,
    };
  }
);
