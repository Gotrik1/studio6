'use server';

/**
 * @fileOverview An AI agent for generating a complete team concept from a single prompt.
 *
 * - generateTeamConcept - A function that handles the generation.
 * - GenerateTeamConceptInput - The input type for the function.
 * - GenerateTeamConceptOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { generateTeamAvatar } from './generate-team-avatar-flow';
import { GenerateTeamConceptInputSchema, GenerateTeamConceptOutputSchema } from './schemas/generate-team-concept-schema';
import type { GenerateTeamConceptInput, GenerateTeamConceptOutput } from './schemas/generate-team-concept-schema';

export type { GenerateTeamConceptInput, GenerateTeamConceptOutput };

export async function generateTeamConcept(input: GenerateTeamConceptInput): Promise<GenerateTeamConceptOutput> {
  return generateTeamConceptFlow_Backend(input);
}

// Define a new, more comprehensive prompt for generating all text content at once.
const generateTeamDetailsPrompt = ai.definePrompt({
    name: 'generateTeamDetailsPrompt_Backend',
    input: { schema: z.string() },
    output: { schema: z.object({
        name: z.string().describe('A creative and cool name for the esports team, in Russian.'),
        motto: z.string().describe('An inspiring or witty motto for the team, in Russian.'),
        description: z.string().describe('A short, epic and engaging description for their team profile page, in Russian (2-3 sentences).'),
    })},
    prompt: `You are a creative director for a sports league. Based on the following team idea, generate a unique team name, a catchy motto, and a short, epic description for their profile. All output must be in Russian.

Team Idea: {{{input}}}
`
});


const generateTeamConceptFlow_Backend = ai.defineFlow(
  {
    name: 'generateTeamConceptFlow_Backend',
    inputSchema: GenerateTeamConceptInputSchema,
    outputSchema: GenerateTeamConceptOutputSchema,
  },
  async ({ prompt }) => {
    // Generate name, motto, description, and avatar in parallel
    const [details, avatar] = await Promise.all([
      generateTeamDetailsPrompt(prompt),
      generateTeamAvatar({ prompt }),
    ]);
    
    const detailsOutput = details.output;
    if (!detailsOutput) {
        throw new Error("Failed to generate team details.");
    }

    return {
        name: detailsOutput.name,
        motto: detailsOutput.motto,
        description: detailsOutput.description,
        avatarDataUri: avatar.avatarDataUri,
    };
  }
);
