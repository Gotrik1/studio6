import { z } from 'zod';

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
