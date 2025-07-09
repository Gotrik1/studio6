import { z } from "zod";

export const TeamRosterMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  role: z.string(),
  status: z.string(),
  adherence: z.number(),
});
export type TeamRosterMember = z.infer<typeof TeamRosterMemberSchema>;

export const TeamDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  motto: z.string(),
  logo: z.string().nullable(),
  dataAiHint: z.string().nullable(),
  game: z.string(),
  rank: z.number(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  membersCount: z.number(),
  captainId: z.string(),
  slug: z.string(),
  homePlaygroundId: z.string().nullable(),
  roster: z.array(TeamRosterMemberSchema),
});
export type TeamDetails = z.infer<typeof TeamDetailsSchema>;

export const UserTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  logo: z.string().nullable(),
  dataAiHint: z.string().nullable(),
  slug: z.string(),
  rank: z.number(),
  game: z.string(),
});
export type UserTeam = z.infer<typeof UserTeamSchema>;

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
export type Team = z.infer<typeof TeamSchema>;
