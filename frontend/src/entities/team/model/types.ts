import type { z } from 'zod';
import type { TeamSchema, TeamDetailsSchema, TeamRosterMemberSchema, UserTeamSchema } from '@/backend/src/ai/flows/schemas/team.schema';

export type Team = z.infer<typeof TeamSchema>;
export type TeamDetails = z.infer<typeof TeamDetailsSchema>;
export type TeamRosterMember = z.infer<typeof TeamRosterMemberSchema>;
export type UserTeam = z.infer<typeof UserTeamSchema>;
