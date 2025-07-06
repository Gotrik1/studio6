import type { z } from "zod";
import type { AnalyzeJoinRequestInputSchema } from "@/ai/flows/schemas/analyze-join-request-schema";

export class AnalyzeJoinRequestDto
  implements z.infer<typeof AnalyzeJoinRequestInputSchema>
{
  readonly teamNeeds: string;
  readonly playerProfile: string;
}
