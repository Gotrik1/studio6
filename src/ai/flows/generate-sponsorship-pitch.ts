
'use server';

/**
 * @fileOverview An AI agent for generating a compelling sponsorship pitch for an esports team.
 *
 * - generateSponsorshipPitch - A function that handles the pitch generation.
 * - GenerateSponsorshipPitchInput - The input type for the function.
 * - GenerateSponsorshipPitchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function generateSponsorshipPitch(input: GenerateSponsorshipPitchInput): Promise<GenerateSponsorshipPitchOutput> {
  return generateSponsorshipPitchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSponsorshipPitchPrompt',
  input: {schema: GenerateSponsorshipPitchInputSchema},
  output: {schema: GenerateSponsorshipPitchOutputSchema},
  prompt: `You are a professional sports marketing agent. Your task is to write a compelling sponsorship pitch for an esports team based on the information provided. The pitch should be professional, confident, and clearly outline the value proposition for a potential sponsor. The language must be Russian.

Team Information:
- Team Name: {{{teamName}}}
- Key Achievements: {{{achievements}}}
- Goals & Needs: {{{goals}}}
- Audience & Media: {{{audience}}}

Structure the pitch as follows:
1.  A strong opening introducing the team and its status.
2.  A body paragraph detailing achievements and audience reach, explaining why sponsoring this team is a good investment.
3.  A concluding paragraph stating the team's goals and what they are looking for in a partnership.

Generate the pitch now.
`,
});

const generateSponsorshipPitchFlow = ai.defineFlow(
  {
    name: 'generateSponsorshipPitchFlow',
    inputSchema: GenerateSponsorshipPitchInputSchema,
    outputSchema: GenerateSponsorshipPitchOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
