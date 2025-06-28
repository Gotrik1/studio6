'use server';

/**
 * @fileOverview An AI agent for generating creative team names and mottos.
 *
 * - createTeam - A function that handles the team creation brainstorming process.
 * - CreateTeamInput - The input type for the createTeam function.
 * - CreateTeamOutput - The return type for the createTeam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CreateTeamInputSchema = z.object({
  description: z.string().describe('A text description of the team idea, its style, origin, or mascot.'),
});
export type CreateTeamInput = z.infer<typeof CreateTeamInputSchema>;

export const CreateTeamOutputSchema = z.object({
  name: z.string().describe('A creative and cool name for the esports team.'),
  motto: z.string().describe('An inspiring or witty motto for the team.'),
});
export type CreateTeamOutput = z.infer<typeof CreateTeamOutputSchema>;

export async function createTeam(input: CreateTeamInput): Promise<CreateTeamOutput> {
  return createTeamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createTeamPrompt',
  input: {schema: CreateTeamInputSchema},
  output: {schema: CreateTeamOutputSchema},
  prompt: `You are a creative director for an esports league. Based on the following description, generate a unique, memorable, and cool team name and a catchy motto. The name should be in Russian, but can use English words if it sounds cool. The motto should also be in Russian.

Description: {{{description}}}

Generate a team name and motto.`,
});

const createTeamFlow = ai.defineFlow(
  {
    name: 'createTeamFlow',
    inputSchema: CreateTeamInputSchema,
    outputSchema: CreateTeamOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
