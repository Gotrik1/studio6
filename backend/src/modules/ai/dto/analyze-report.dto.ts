import type { z } from "zod";
import type { AnalyzeReportInputSchema } from "@/ai/flows/schemas/analyze-report-schema";

export class AnalyzeReportDto
  implements z.infer<typeof AnalyzeReportInputSchema>
{
  readonly reportReason: string;
  readonly evidenceContext: string;
  readonly reportedUserActivity: string;
}
