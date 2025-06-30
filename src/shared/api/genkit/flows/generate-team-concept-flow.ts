
'use server';

/**
 * @fileOverview An AI agent for generating a complete team concept from a single prompt.
 *
 * - generateTeamConcept - A function that handles the generation.
 * - GenerateTeamConceptInput - The input type for the function.
 * - GenerateTeamConceptOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import {z} from 'genkit';
import {createTeam} from './create-team-flow';
import {generateTeamAvatar} from './generate-team-avatar-flow';
import { GenerateTeamConceptInputSchema, GenerateTeamConceptOutputSchema } from './schemas/generate-team-concept-schema';
import type { GenerateTeamConceptInput, GenerateTeamConceptOutput } from './schemas/generate-team-concept-schema';

export type { GenerateTeamConceptInput, GenerateTeamConceptOutput };


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
