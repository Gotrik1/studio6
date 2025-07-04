'use server';

/**
 * @fileOverview An AI agent for generating creative team names and mottos.
 *
 * - createTeam - A function that handles the team creation brainstorming process.
 * - CreateTeamInput - The input type for the createTeam function.
 * - CreateTeamOutput - The return type for the createTeam function.
 */

import { ai } from '../genkit';
import { CreateTeamInputSchema, CreateTeamOutputSchema } from './schemas/create-team-schema';
import type { CreateTeamInput, CreateTeamOutput } from './schemas/create-team-schema';

export type { CreateTeamInput, CreateTeamOutput };

export async function createTeam(input: CreateTeamInput): Promise<CreateTeamOutput> {
  return createTeamFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: 'createTeamPrompt_Backend',
  input: {schema: CreateTeamInputSchema},
  output: {schema: CreateTeamOutputSchema},
  prompt: `You are a creative director for a sports league. Based on the following description, generate a unique, memorable, and cool team name and a catchy motto. The name should be in Russian, but can use English words if it sounds cool. The motto should also be in Russian.

Description: {{{description}}}

Generate a team name and motto.`,
});

const createTeamFlow_Backend = ai.defineFlow(
  {
    name: 'createTeamFlow_Backend',
    inputSchema: CreateTeamInputSchema,
    outputSchema: CreateTeamOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
