import { z } from "zod";

export const GenerateContentInputSchema = z.object({
  topic: z.string().describe("The main topic or keywords for the content."),
  tone: z
    .string()
    .describe(
      "The desired tone for the content (e.g., enthusiastic, professional, witty).",
    ),
  contentType: z
    .string()
    .describe(
      "The type of content to generate (e.g., news post, tweet, match summary).",
    ),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

export const GenerateContentOutputSchema = z.object({
  generatedText: z.string().describe("The AI-generated content."),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;
