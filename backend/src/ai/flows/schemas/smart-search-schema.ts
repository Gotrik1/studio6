import { z } from "zod";
import { TeamSchema as TeamDataSchema } from './team.schema';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  profileUrl: z.string(),
});

export const TeamSchema = TeamDataSchema;

export const TournamentSchema = z.object({
  name: z.string(),
  game: z.string(),
  status: z.string(),
  image: z.string(),
  dataAiHint: z.string(),
  slug: z.string(),
});

export const SmartSearchInputSchema = z
  .string()
  .describe("The user's natural language search query.");
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

export const SmartSearchOutputSchema = z.object({
  users: z.array(UserSchema).describe("A list of users relevant to the query."),
  teams: z.array(TeamSchema).describe("A list of teams relevant to the query."),
  tournaments: z
    .array(TournamentSchema)
    .describe("A list of tournaments relevant to the query."),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;
