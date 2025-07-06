import type { z } from "zod";
import type { GeneratePostImageInputSchema } from "@/ai/flows/schemas/generate-post-image-schema";

export class GeneratePostImageDto {
  readonly prompt: z.infer<typeof GeneratePostImageInputSchema>;
}
