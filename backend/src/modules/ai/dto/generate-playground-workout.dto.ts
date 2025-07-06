import type { z } from "zod";
import type { GeneratePlaygroundWorkoutInputSchema } from "@/ai/flows/schemas/generate-playground-workout-schema";

export class GeneratePlaygroundWorkoutDto
  implements z.infer<typeof GeneratePlaygroundWorkoutInputSchema>
{
  readonly playgroundType: string;
  readonly equipment: string[];
}
