import type { z } from "zod";
import type { AnalyzeTeamPerformanceInputSchema } from "@/ai/flows/schemas/analyze-team-performance-schema";

export class AnalyzeTeamPerformanceDto
  implements z.infer<typeof AnalyzeTeamPerformanceInputSchema>
{
  readonly teamName: string;
  readonly recentMatches: string;
  readonly playerStats: {
    name: string;
    kda: string;
    winRate: string;
    recentPerformanceTrend: "up" | "down" | "stable";
  }[];
}
