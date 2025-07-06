import type { z } from "zod";
import type { AnalyzeEsportsPerformanceInputSchema } from "@/ai/flows/schemas/analyze-esports-performance-schema";

export class AnalyzeEsportsPerformanceDto
  implements z.infer<typeof AnalyzeEsportsPerformanceInputSchema>
{
  readonly playerStats: string;
  readonly matchHistory: string;
}
