
import { z } from 'zod';

export const GenerateSponsorshipPitchInputSchema = z.object({
  teamName: z.string().describe("The name of the team."),
  achievements: z.string().describe("A summary of the team's key achievements and rank."),
  goals: z.string().describe("The team's future goals and what they need sponsorship for (e.g., new gear, travel expenses)."),
  audience: z.string().describe("A brief description of the team's fanbase and social media presence."),
});
export type GenerateSponsorshipPitchInput = z.infer<typeof GenerateSponsorshipPitchInputSchema>;

export const GenerateSponsorshipPitchOutputSchema = z.object({
  pitch: z.string().describe("A professional and persuasive sponsorship pitch, written in Russian, about 2-3 paragraphs long."),
});
export type GenerateSponsorshipPitchOutput = z.infer<typeof GenerateSponsorshipPitchOutputSchema>;
