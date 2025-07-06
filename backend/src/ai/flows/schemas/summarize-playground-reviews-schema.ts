import { z } from "zod";

export const SummarizePlaygroundReviewsInputSchema = z.object({
  reviews: z
    .array(z.string())
    .describe("An array of user review texts about a playground."),
});
export type SummarizePlaygroundReviewsInput = z.infer<
  typeof SummarizePlaygroundReviewsInputSchema
>;

export const SummarizePlaygroundReviewsOutputSchema = z.object({
  pros: z
    .array(z.string())
    .describe("A list of 2-3 key positive points mentioned in the reviews."),
  cons: z
    .array(z.string())
    .describe(
      "A list of 2-3 key negative points or drawbacks mentioned in the reviews.",
    ),
});
export type SummarizePlaygroundReviewsOutput = z.infer<
  typeof SummarizePlaygroundReviewsOutputSchema
>;
