import type { z } from "zod";
import type { AnalyzeMatchReportInputSchema } from "@/ai/flows/schemas/analyze-match-report-schema";

export class AnalyzeMatchReportDto
  implements z.infer<typeof AnalyzeMatchReportInputSchema>
{
  readonly team1Name: string;
  readonly team2Name: string;
  readonly score: string;
  readonly tournament: string;
  readonly events: {
    time: string;
    event: string;
    player: string;
    team: string;
  }[];
  readonly lineupTeam1: {
    name: string;
    role: string;
    avatar: string;
    avatarHint?: string;
  }[];
  readonly lineupTeam2: {
    name: string;
    role: string;
    avatar: string;
    avatarHint?: string;
  }[];
}
