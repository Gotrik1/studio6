import { z } from "zod";
import { TeamSchema as TeamDataSchema } from "./team.schema"; // Renamed to avoid conflict

export const TeamSchema = TeamDataSchema.pick({
  name: true,
  motto: true,
  logo: true,
  dataAiHint: true,
  rank: true,
  slug: true,
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
