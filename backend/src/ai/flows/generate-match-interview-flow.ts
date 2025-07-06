"use server";

/**
 * @fileOverview A flow for generating a post-match audio interview.
 * - generateMatchInterview - A function that handles interview generation.
 * - GenerateMatchInterviewInput - The input type for the function.
 * - GenerateMatchInterviewOutput - The return type for the function.
 */

import { ai } from "../genkit";
import { generateDialogue } from "./dialogue-generation-flow";
import { multiSpeakerTts } from "./multi-speaker-tts-flow";
import {
  GenerateMatchInterviewInputSchema,
  GenerateMatchInterviewOutputSchema,
} from "./schemas/generate-match-interview-schema";
import type {
  GenerateMatchInterviewInput,
  GenerateMatchInterviewOutput,
} from "./schemas/generate-match-interview-schema";

export type { GenerateMatchInterviewInput, GenerateMatchInterviewOutput };

export async function generateMatchInterview(
  input: GenerateMatchInterviewInput,
): Promise<GenerateMatchInterviewOutput> {
  return generateMatchInterviewFlow_Backend(input);
}

const generateMatchInterviewFlow_Backend = ai.defineFlow(
  {
    name: "generateMatchInterviewFlow_Backend",
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
  },
);
