'use server';

/**
 * @fileOverview An AI agent for generating a complete team concept from a single prompt.
 *
 * - generateTeamConcept - A function that handles the generation.
 * - GenerateTeamConceptInput - The input type for the function.
 * - GenerateTeamConceptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {createTeam} from './create-team-flow';
import {generateTeamAvatar} from './generate-team-avatar-flow';


export const GenerateTeamConceptInputSchema = z.object({
  prompt: z.string().describe('A simple text prompt describing the team idea, e.g., "An aggressive CS:GO 2 team from Moscow, our symbol is a wolf".'),
});
export type GenerateTeamConceptInput = z.infer<typeof GenerateTeamConceptInputSchema>;

export const GenerateTeamConceptOutputSchema = z.object({
  name: z.string().describe('The generated name of the team.'),
  motto: z.string().describe('A catchy motto for the team.'),
  description: z.string().describe('A short, epic description for the team profile.'),
  avatarDataUri: z.string().describe("The generated team logo image as a data URI."),
});
export type GenerateTeamConceptOutput = z.infer<typeof GenerateTeamConceptOutputSchema>;


export async function generateTeamConcept(input: GenerateTeamConceptInput): Promise<GenerateTeamConceptOutput> {
  return generateTeamConceptFlow(input);
}


const generateTeamConceptFlow = ai.defineFlow(
  {
    name: 'generateTeamConceptFlow',
    inputSchema: GenerateTeamConceptInputSchema,
    outputSchema: GenerateTeamConceptOutputSchema,
  },
  async ({ prompt }) => {
    // Generate name, motto, avatar, and description in parallel
    const [details, avatar, descriptionResult] = await Promise.all([
      createTeam({ description: prompt }),
      generateTeamAvatar({ prompt }),
      ai.generate({
          prompt: `Based on the team idea "${prompt}", write a short, epic and engaging description for their team profile page. Keep it to 2-3 sentences. Respond in Russian.`,
          output: {
              schema: z.string(),
          }
      })
    ]);
    
    const description = descriptionResult.output;
    if (!description) {
        throw new Error("Failed to generate team description.");
    }

    return {
        name: details.name,
        motto: details.motto,
        description,
        avatarDataUri: avatar.avatarDataUri,
    };
  }
);
