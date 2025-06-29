import { z } from 'zod';

export const TeamSchema = z.object({
    slug: z.string(),
    name: z.string(),
    logo: z.string(),
    logoHint: z.string(),
    game: z.string(),
    pitch: z.string(),
    needs: z.string(),
});

export const SponsorshipScoutInputSchema = z.string().describe('A natural language description of the sponsor\'s marketing goals and desired target audience.');
export type SponsorshipScoutInput = z.infer<typeof SponsorshipScoutInputSchema>;

export const SponsorshipScoutOutputSchema = z.object({
    recommendations: z.array(TeamSchema).describe('A list of up to 3 teams that best match the sponsor\'s goals.'),
    reasoning: z.string().describe('A brief explanation of why these specific teams were recommended.'),
});
export type SponsorshipScoutOutput = z.infer<typeof SponsorshipScoutOutputSchema>;
