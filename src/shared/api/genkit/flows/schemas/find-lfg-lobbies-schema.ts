import { z } from 'zod';

export const LfgLobbySchema = z.object({
  id: z.string(),
  sport: z.string(),
  location: z.string(),
  time: z.string(),
  playersNeeded: z.number(),
  playersJoined: z.number(),
  comment: z.string(),
  creator: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
});
export type LfgLobby = z.infer<typeof LfgLobbySchema>;

export const FindLfgLobbiesInputSchema = z.string().describe("A natural language query from a user looking for a game to join.");
export type FindLfgLobbiesInput = z.infer<typeof FindLfgLobbiesInputSchema>;

export const FindLfgLobbiesOutputSchema = z.object({
    recommendations: z.array(LfgLobbySchema).describe("A list of up to 5 recommended game lobbies that best match the user's query."),
});
export type FindLfgLobbiesOutput = z.infer<typeof FindLfgLobbiesOutputSchema>;
