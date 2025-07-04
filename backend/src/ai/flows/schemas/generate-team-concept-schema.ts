
import { z } from 'zod';

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
