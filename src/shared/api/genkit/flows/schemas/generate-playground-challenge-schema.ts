import { z } from 'zod';

export const GeneratePlaygroundChallengeInputSchema = z.object({
  playgroundName: z.string().describe('The name of the playground.'),
  playgroundType: z.string().describe('The type of sport the playground is for (e.g., "Футбол", "Баскетбол").'),
  topPlayerName: z.string().describe('The name of the top player on this playground.'),
  topPlayerStat: z.string().describe("The top player's relevant stat, e.g., '45 чекинов' or '15 побед'."),
});
export type GeneratePlaygroundChallengeInput = z.infer<typeof GeneratePlaygroundChallengeInputSchema>;

export const GeneratePlaygroundChallengeOutputSchema = z.object({
  title: z.string().describe('A catchy title for the challenge.'),
  description: z.string().describe('A short, clear description of what the user needs to do.'),
  reward: z.number().describe('The reward in PD (ProDvor Dollars) for completing the challenge.'),
});
export type GeneratePlaygroundChallengeOutput = z.infer<typeof GeneratePlaygroundChallengeOutputSchema>;
