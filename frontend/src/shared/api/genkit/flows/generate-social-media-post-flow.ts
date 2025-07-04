'use server';

/**
 * @fileOverview An AI agent for generating social media content for a sports team.
 *
 * - generateSocialMediaPost - A function that handles the post generation.
 * - GenerateSocialMediaPostInput - The input type for the function.
 * - GenerateSocialMediaPostOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { GenerateSocialMediaPostInputSchema, GenerateSocialMediaPostOutputSchema } from './schemas/generate-social-media-post-schema';
import type { GenerateSocialMediaPostInput, GenerateSocialMediaPostOutput } from './schemas/generate-social-media-post-schema';

export type { GenerateSocialMediaPostInput, GenerateSocialMediaPostOutput };

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are a creative SMM manager for the esports team "{{teamName}}".
Your task is to generate a social media post based on the provided details.
The post should be engaging, exciting, and appropriate for platforms like Twitter or Instagram.
Respond in Russian.

Post Type: {{postType}}
Context: "{{context}}"

Instructions:
1.  **Post Text**: Write a compelling and concise text for the post.
2.  **Hashtags**: Generate 3-5 relevant hashtags, including the team name and the game (e.g., #GoEagles, #Valorant).
3.  **Image Prompt**: Create a descriptive prompt for an AI image generator to create a stunning visual for this post.
`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
