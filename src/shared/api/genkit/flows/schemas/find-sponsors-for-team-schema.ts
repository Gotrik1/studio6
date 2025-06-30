import { z } from 'zod';

// Schema for a sponsor, used in the tool and output
export const SponsorSchema = z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    logoHint: z.string(),
    description: z.string(),
    profileUrl: z.string(),
    interests: z.array(z.string()),
});
export type Sponsor = z.infer<typeof SponsorSchema>;


// Input for the main flow
export const FindSponsorsForTeamInputSchema = z.object({
  teamName: z.string().describe("The name of the team seeking sponsorship."),
  teamGame: z.string().describe("The primary game the team plays."),
  teamDescription: z.string().describe("A brief description of the team, its audience, and its needs."),
});
export type FindSponsorsForTeamInput = z.infer<typeof FindSponsorsForTeamInputSchema>;

// Output of the main flow
export const FindSponsorsForTeamOutputSchema = z.object({
    recommendations: z.array(z.object({
        sponsor: SponsorSchema,
        reasoning: z.string().describe("A brief explanation of why this sponsor is a good match for the team."),
    })).describe('A list of up to 3 recommended sponsors that best match the team\'s profile.'),
});
export type FindSponsorsForTeamOutput = z.infer<typeof FindSponsorsForTeamOutputSchema>;
