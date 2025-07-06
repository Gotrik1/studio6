import type { z } from "zod";
import type { AnalyzeRoleChangeInputSchema } from "@/ai/flows/schemas/analyze-role-change-schema";

export class AnalyzeRoleChangeDto
  implements z.infer<typeof AnalyzeRoleChangeInputSchema>
{
  readonly userName: string;
  readonly currentRole: string;
  readonly requestedRole: string;
  readonly activitySummary: string;
}
