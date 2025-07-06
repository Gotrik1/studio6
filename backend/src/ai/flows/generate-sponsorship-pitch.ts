"use server";

/**
 * @fileOverview An AI agent for generating a compelling sponsorship pitch for an esports team.
 *
 * - generateSponsorshipPitch - A function that handles the pitch generation.
 * - GenerateSponsorshipPitchInput - The input type for the function.
 * - GenerateSponsorshipPitchOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GenerateSponsorshipPitchInputSchema,
  GenerateSponsorshipPitchOutputSchema,
} from "./schemas/generate-sponsorship-pitch-schema";
import type {
  GenerateSponsorshipPitchInput,
  GenerateSponsorshipPitchOutput,
} from "./schemas/generate-sponsorship-pitch-schema";

export type { GenerateSponsorshipPitchInput, GenerateSponsorshipPitchOutput };

export async function generateSponsorshipPitch(
  input: GenerateSponsorshipPitchInput,
): Promise<GenerateSponsorshipPitchOutput> {
  return generateSponsorshipPitchFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "generateSponsorshipPitchPrompt_Backend",
  input: { schema: GenerateSponsorshipPitchInputSchema },
  output: { schema: GenerateSponsorshipPitchOutputSchema },
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

const generateSponsorshipPitchFlow_Backend = ai.defineFlow(
  {
    name: "generateSponsorshipPitchFlow_Backend",
    inputSchema: GenerateSponsorshipPitchInputSchema,
    outputSchema: GenerateSponsorshipPitchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
