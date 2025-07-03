
import { z } from 'zod';

export const CreateTeamInputSchema = z.object({
  description: z.string().describe('A text description of the team idea, its style, origin, or mascot.'),
});
export type CreateTeamInput = z.infer<typeof CreateTeamInputSchema>;

export const CreateTeamOutputSchema = z.object({
  name: z.string().describe('A creative and cool name for the esports team.'),
  motto: z.string().describe('An inspiring or witty motto for the team.'),
});
export type CreateTeamOutput = z.infer<typeof CreateTeamOutputSchema>;
