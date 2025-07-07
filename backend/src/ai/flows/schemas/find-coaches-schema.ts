import { z } from "zod";

export const CoachSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  avatarHint: z.string(),
  specialization: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  rating: z.number(),
  price: z.string(),
  profileUrl: z.string(),
});

export const FindCoachesInputSchema = z
  .string()
  .describe(
    "A natural language query from a user looking for a coach to help them improve.",
  );
export type FindCoachesInput = z.infer<typeof FindCoachesInputSchema>;

export const FindCoachesOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        coach: CoachSchema,
        reasoning: z
          .string()
          .describe(
            "A brief explanation of why this coach is a good match for the user's request.",
          ),
      }),
    )
    .describe(
      "A list of up to 3 recommended coaches that best match the user's query.",
    ),
});
export type FindCoachesOutput = z.infer<typeof FindCoachesOutputSchema>;
