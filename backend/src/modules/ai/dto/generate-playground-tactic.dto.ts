import type { z } from "zod";
import type { GeneratePlaygroundTacticInputSchema } from "@/ai/flows/schemas/generate-playground-tactic-schema";

export class GeneratePlaygroundTacticDto
  implements z.infer<typeof GeneratePlaygroundTacticInputSchema>
{
  readonly playgroundType: string;
  readonly playgroundFeatures: string[];
  readonly teamPlaystyle: string;
}
