import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  profileUrl: z.string(),
});

export const TeamSchema = z.object({
    id: z.string(),
    name: z.string(),
    motto: z.string(),
    logo: z.string(),
    dataAiHint: z.string(),
    game: z.string(),
    rank: z.number(),
    members: z.number(),
    captain: z.string(),
    slug: z.string(),
    homePlaygroundId: z.string().nullable(),
});

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
