import type { z } from "zod";
import type { GenerateMatchInterviewInputSchema } from "@/ai/flows/schemas/generate-match-interview-schema";

export class GenerateMatchInterviewDto
  implements z.infer<typeof GenerateMatchInterviewInputSchema>
{
  readonly matchSummary: string;
  readonly mvpName: string;
}
