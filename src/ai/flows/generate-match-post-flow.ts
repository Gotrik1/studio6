'use server';

/**
 * @fileOverview An AI agent for generating a social media post about a completed match.
 *
 * - generateMatchPost - A function that handles the post generation.
 * - GenerateMatchPostInput - The input type for the function.
 * - GenerateMatchPostOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateContent } from './generate-content-flow';
import { generatePostImage } from './generate-post-image-flow';

export const GenerateMatchPostInputSchema = z.object({
    winningTeam: z.string().describe("The name of the winning team."),
    losingTeam: z.string().describe("The name of the losing team."),
    score: z.string().describe("The final score of the match."),
    matchSummary: z.string().describe("A brief summary of the match highlights."),
});
export type GenerateMatchPostInput = z.infer<typeof GenerateMatchPostInputSchema>;

export const GenerateMatchPostOutputSchema = z.object({
  postText: z.string().describe('The generated text for the social media post.'),
  imageDataUri: z.string().describe("The generated image for the post as a data URI."),
});
export type GenerateMatchPostOutput = z.infer<typeof GenerateMatchPostOutputSchema>;


export async function generateMatchPost(input: GenerateMatchPostInput): Promise<GenerateMatchPostOutput> {
  return generateMatchPostFlow(input);
}


const generateMatchPostFlow = ai.defineFlow(
  {
    name: 'generateMatchPostFlow',
    inputSchema: GenerateMatchPostInputSchema,
    outputSchema: GenerateMatchPostOutputSchema,
  },
  async ({ winningTeam, losingTeam, score, matchSummary }) => {
    
    const textPrompt = `A victory post for the team ${winningTeam}. They won against ${losingTeam} with a score of ${score}. Key highlights: ${matchSummary}.`;
    
    // Generate text and image in parallel
    const textPromise = generateContent({
        topic: textPrompt,
        tone: 'enthusiastic',
        contentType: 'social media post',
    });

    const imagePrompt = `A victorious esports team (${winningTeam}) celebrating their win with score ${score} visible.`;
    const imagePromise = generatePostImage(imagePrompt);

    const [textResult, imageResult] = await Promise.all([
      textPromise,
      imagePromise,
    ]);

    return {
        postText: textResult.generatedText,
        imageDataUri: imageResult.imageDataUri,
    };
  }
);
