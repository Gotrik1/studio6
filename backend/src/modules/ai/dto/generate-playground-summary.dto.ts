import type { z } from "zod";
import type { GeneratePlaygroundSummaryInputSchema } from "@/ai/flows/schemas/generate-playground-summary-schema";

export class GeneratePlaygroundSummaryDto
  implements z.infer<typeof GeneratePlaygroundSummaryInputSchema>
{
  readonly name: string;
  readonly address: string;
  readonly surface: string;
  readonly features: string[];
}
