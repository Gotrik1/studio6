import type { FindCoachesInputSchema } from "@/ai/flows/schemas/find-coaches-schema";
import type { z } from "zod";

export class FindCoachesDto {
  readonly input: z.infer<typeof FindCoachesInputSchema>;
}
