import { z } from 'zod';

export const GeneratePlaygroundLoreInputSchema = z.object({
  playgroundName: z.string().describe('The name of the playground.'),
  topPlayer: z.string().describe('The name of the player with the most check-ins or wins at this playground.'),
  topTeam: z.string().describe('The name of the team that plays here most often.'),
  checkIns: z.number().describe('Total number of check-ins at this playground.'),
});
export type GeneratePlaygroundLoreInput = z.infer<typeof GeneratePlaygroundLoreInputSchema>;

export const GeneratePlaygroundLoreOutputSchema = z.object({
  lore: z.string().describe('A short, engaging, epic-sounding piece of "lore" or history about the playground.'),
});
export type GeneratePlaygroundLoreOutput = z.infer<typeof GeneratePlaygroundLoreOutputSchema>;
