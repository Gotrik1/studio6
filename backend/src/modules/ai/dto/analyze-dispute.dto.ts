import type { z } from "zod";
import type { AnalyzeDisputeInputSchema } from "@/ai/flows/schemas/analyze-dispute-schema";

export class AnalyzeDisputeDto
  implements z.infer<typeof AnalyzeDisputeInputSchema>
{
  readonly team1Name: string;
  readonly team2Name: string;
  readonly disputeReason: string;
  readonly team1Evidence: string;
  readonly team2Evidence: string;
}
