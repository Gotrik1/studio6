"use server";
/**
 * @fileOverview An AI agent for generating a play-by-play commentary for a match.
 *
 * - generateMatchCommentary - A function that handles the commentary generation.
 * - GenerateMatchCommentaryInput - The input type for the function.
 * - GenerateMatchCommentaryOutput - The return type for the function.
 */

import { ai } from "../genkit";
import { z } from "zod";
import {
  GenerateMatchCommentaryInputSchema,
  GenerateMatchCommentaryOutputSchema,
} from "./schemas/generate-match-commentary-schema";
import type { GenerateMatchCommentaryInput } from "./schemas/generate-match-commentary-schema";
import { generateDialogue } from "./dialogue-generation-flow";
import { multiSpeakerTts } from "./multi-speaker-tts-flow";

// Define the final schema for the flow's output
const FinalOutputSchema = GenerateMatchCommentaryOutputSchema.extend({
  audioDataUri: z
    .string()
    .describe("The generated audio commentary as a data URI in WAV format."),
});

// Define and export the final output type
export type GenerateMatchCommentaryOutput = z.infer<typeof FinalOutputSchema>;
export type { GenerateMatchCommentaryInput };

export async function generateMatchCommentary(
  input: GenerateMatchCommentaryInput,
): Promise<GenerateMatchCommentaryOutput> {
  return generateMatchCommentaryFlow_Backend(input);
}

const generateMatchCommentaryFlow_Backend = ai.defineFlow(
  {
    name: "generateMatchCommentaryFlow_Backend",
    inputSchema: GenerateMatchCommentaryInputSchema,
    outputSchema: FinalOutputSchema,
  },
  async ({
    team1Name,
    team2Name,
    events,
  }): Promise<GenerateMatchCommentaryOutput> => {
    // 1. Create a detailed topic for the dialogue generation flow.
    const eventsString = events
      .map((e) => `- ${e.time}: ${e.event} by ${e.player} (${e.team})`)
      .join("\n");
    const dialogueTopic = `Generate an exciting, energetic play-by-play commentary script for a match between ${team1Name} and ${team2Name}. It should be a dialogue between two commentators, Speaker1 and Speaker2. Use these key events for context:\n${eventsString}`;

    // 2. Generate the dialogue script.
    const { dialogue } = await generateDialogue(dialogueTopic);

    if (!dialogue) {
      throw new Error("Failed to generate commentary script.");
    }

    // 3. Generate the multi-speaker audio from the script.
    const { audioDataUri } = await multiSpeakerTts(dialogue);

    return {
      commentaryScript: dialogue,
      audioDataUri,
    };
  },
);
