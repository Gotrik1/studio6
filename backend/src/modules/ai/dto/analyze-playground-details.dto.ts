import type { z } from "zod";
import type { AnalyzePlaygroundDetailsInputSchema } from "@/ai/flows/schemas/analyze-playground-details-schema";

export class AnalyzePlaygroundDetailsDto
  implements z.infer<typeof AnalyzePlaygroundDetailsInputSchema>
{
  readonly name: string;
  readonly type: string;
  readonly surface: string;
  readonly features: string[];
  readonly rating: number;
}
