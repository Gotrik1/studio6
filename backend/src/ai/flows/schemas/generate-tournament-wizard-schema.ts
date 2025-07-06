import { z } from "zod";

export const GenerateTournamentWizardInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A simple text prompt describing the tournament idea, e.g., "Weekly Valorant tournament for amateurs".',
    ),
});
export type GenerateTournamentWizardInput = z.infer<
  typeof GenerateTournamentWizardInputSchema
>;

export const GenerateTournamentWizardOutputSchema = z.object({
  name: z.string().describe("The generated name of the tournament."),
  description: z
    .string()
    .describe("A short, exciting description for the tournament announcement."),
  game: z.string().describe("The game or sport for the tournament."),
  type: z.enum(["team", "individual"]).describe("The tournament type."),
  format: z
    .enum(["single_elimination", "round_robin", "groups"])
    .describe("The tournament format."),
  imageDataUri: z
    .string()
    .describe("The generated tournament banner image as a data URI."),
  prizePool: z.string().describe("A suggested prize pool structure."),
  registrationEndDate: z
    .string()
    .describe("The suggested registration end date in 'YYYY-MM-DD' format."),
  tournamentStartDate: z
    .string()
    .describe("The suggested tournament start date in 'YYYY-MM-DD' format."),
});
export type GenerateTournamentWizardOutput = z.infer<
  typeof GenerateTournamentWizardOutputSchema
>;
