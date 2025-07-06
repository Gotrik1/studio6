import type { z } from "zod";
import type { AnalyzeExerciseFormInputSchema } from "@/ai/flows/schemas/analyze-exercise-form-schema";

export class AnalyzeExerciseFormDto
  implements z.infer<typeof AnalyzeExerciseFormInputSchema>
{
  readonly videoDataUri: string;
  readonly exerciseName: string;
}
