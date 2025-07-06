import type { z } from "zod";
import type { GenerateSportSummaryInputSchema } from "@/ai/flows/schemas/generate-sport-summary-schema";

export class GenerateSportSummaryDto
  implements z.infer<typeof GenerateSportSummaryInputSchema>
{
  readonly sportName: string;
}
