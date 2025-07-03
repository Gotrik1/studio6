import { z } from 'zod';

export const TournamentMatchResultSchema = z.object({
    team1: z.string(),
    team2: z.string(),
    score: z.string(),
});

export const GenerateTournamentSummaryInputSchema = z.object({
  tournamentName: z.string(),
  tournamentGame: z.string(),
  finalMatch: TournamentMatchResultSchema,
  champion: z.string(),
});
export type GenerateTournamentSummaryInput = z.infer<typeof GenerateTournamentSummaryInputSchema>;

export const GenerateTournamentSummaryOutputSchema = z.object({
  summaryArticle: z.string().describe("A 1-2 paragraph summary article about the entire tournament, highlighting the champion's path to victory."),
  mvp: z.object({
    name: z.string().describe("The name of the tournament's Most Valuable Player (MVP). This should be a player from the winning team."),
    reason: z.string().describe("A brief justification for the MVP choice."),
  }),
  socialMediaPost: z.string().describe("A short, engaging social media post congratulating the winner."),
  imagePrompts: z.array(z.string()).describe("An array of 3-4 distinct text prompts for an image generation model to create highlight pictures for the tournament."),
});
export type GenerateTournamentSummaryOutput = z.infer<typeof GenerateTournamentSummaryOutputSchema>;
