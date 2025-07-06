import type { z } from "zod";
import type { PredictMatchOutcomeInputSchema } from "@/ai/flows/schemas/predict-match-outcome-schema";

export class PredictMatchOutcomeDto
  implements z.infer<typeof PredictMatchOutcomeInputSchema>
{
  readonly team1: { name: string; winRate: string; recentForm: string };
  readonly team2: { name: string; winRate: string; recentForm: string };
  readonly headToHead?: string;
  readonly matchContext?: string;
}
