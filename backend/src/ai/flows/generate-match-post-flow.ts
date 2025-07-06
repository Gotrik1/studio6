"use server";

/**
 * @fileOverview An AI agent for generating a social media post about a completed match.
 *
 * - generateMatchPost - A function that handles the post generation.
 * - GenerateMatchPostInput - The input type for the function.
 * - GenerateMatchPostOutput - The return type for the function.
 */

import { ai } from "../genkit";
import { generateContent } from "./generate-content-flow";
import { generatePostImage_Backend } from "./generate-post-image-flow";
import {
  GenerateMatchPostInputSchema,
  GenerateMatchPostOutputSchema,
} from "./schemas/generate-match-post-schema";
import type {
  GenerateMatchPostInput,
  GenerateMatchPostOutput,
} from "./schemas/generate-match-post-schema";

export type { GenerateMatchPostInput, GenerateMatchPostOutput };

export async function generateMatchPost(
  input: GenerateMatchPostInput,
): Promise<GenerateMatchPostOutput> {
  return generateMatchPostFlow_Backend(input);
}

const generateMatchPostFlow_Backend = ai.defineFlow(
  {
    name: "generateMatchPostFlow_Backend",
    inputSchema: GenerateMatchPostInputSchema,
    outputSchema: GenerateMatchPostOutputSchema,
  },
  async ({ winningTeam, losingTeam, score, matchSummary }) => {
    const textPrompt = `A victory post for the team ${winningTeam}. They won against ${losingTeam} with a score of ${score}. Key highlights: ${matchSummary}.`;

    // Generate text and image in parallel
    const textPromise = generateContent({
      topic: textPrompt,
      tone: "enthusiastic",
      contentType: "social media post",
    });

    const imagePrompt = `A victorious sports team (${winningTeam}) celebrating their win with score ${score} visible.`;
    const imagePromise = generatePostImage_Backend(imagePrompt);

    const [textResult, imageResult] = await Promise.all([
      textPromise,
      imagePromise,
    ]);

    return {
      postText: textResult.generatedText,
      imageDataUri: imageResult.imageDataUri,
    };
  },
);
