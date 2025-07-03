
import { z } from 'zod';

export const PlayerProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  profileUrl: z.string(),
  statsSummary: z.string().describe("A brief summary of the player's stats and playstyle."),
});

export const PlayerScoutInputSchema = z.string().describe('A natural language description of the desired player, including role, game, playstyle, etc.');
export type PlayerScoutInput = z.infer<typeof PlayerScoutInputSchema>;

export const PlayerScoutOutputSchema = z.object({
    recommendations: z.array(z.object({
        player: PlayerProfileSchema,
        reasoning: z.string().describe("A brief explanation of why this player is a good match for the request."),
    })).describe('A list of up to 5 recommended players that best match the query.'),
});
export type PlayerScoutOutput = z.infer<typeof PlayerScoutOutputSchema>;
