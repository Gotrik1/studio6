import type { z } from "zod";
import type { AnalyzeContentInputSchema } from "@/ai/flows/schemas/analyze-content-generation-schema";

export class AnalyzeContentDto
  implements z.infer<typeof AnalyzeContentInputSchema>
{
  readonly content: string;
  readonly contentType: string;
}
