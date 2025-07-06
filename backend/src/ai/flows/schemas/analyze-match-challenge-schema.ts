import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string(),
  motto: z.string(),
  logo: z.string(),
  dataAiHint: z.string(),
  rank: z.number(),
  slug: z.string(),
});

export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  surfaceType: z.string(),
  price: z.string(),
  image: z.string(),
  imageHint: z.string(),
});

export const AnalyzeMatchChallengeInputSchema = z
  .string()
  .describe(
    'A natural language prompt describing the desired match. e.g., "Хочу сыграть в футбол в субботу вечером против равной по силе команды"',
  );
export type AnalyzeMatchChallengeInput = z.infer<
  typeof AnalyzeMatchChallengeInputSchema
>;

export const AnalyzeMatchChallengeOutputSchema = z.object({
  suggestedTeams: z
    .array(TeamSchema)
    .describe(
      "A list of up to 3 suggested opponent teams that fit the description.",
    ),
  suggestedVenues: z
    .array(VenueSchema)
    .describe("A list of up to 3 suggested venues that fit the description."),
});
export type AnalyzeMatchChallengeOutput = z.infer<
  typeof AnalyzeMatchChallengeOutputSchema
>;
