import { z } from "zod";

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

export const FindSponsorsForTeamInputSchema = z.object({
  teamName: z.string().describe("The name of the team looking for a sponsor."),
  teamGame: z.string().describe("The primary game or sport the team plays."),
  teamDescription: z
    .string()
    .describe(
      "A description of the team, its achievements, and what it needs from a sponsor.",
    ),
});
export type FindSponsorsForTeamInput = z.infer<
  typeof FindSponsorsForTeamInputSchema
>;

export const FindSponsorsForTeamOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        sponsor: SponsorSchema,
        reasoning: z
          .string()
          .describe(
            "A brief explanation of why this sponsor is a good match for the team.",
          ),
      }),
    )
    .describe(
      "A list of up to 3 recommended sponsors that best match the team's profile.",
    ),
});
export type FindSponsorsForTeamOutput = z.infer<
  typeof FindSponsorsForTeamOutputSchema
>;
