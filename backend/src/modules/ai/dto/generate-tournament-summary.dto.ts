import type { z } from "zod";
import type {
  GenerateTournamentSummaryInputSchema,
  TournamentMatchResultSchema,
} from "@/ai/flows/schemas/generate-tournament-summary-schema";

export class GenerateTournamentSummaryDto
  implements z.infer<typeof GenerateTournamentSummaryInputSchema>
{
  readonly tournamentName: string;
  readonly tournamentGame: string;
  readonly finalMatch: z.infer<typeof TournamentMatchResultSchema>;
  readonly champion: string;
}
