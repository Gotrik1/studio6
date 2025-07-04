import { z } from 'zod';

export const AnalyzeContentInputSchema = z.object({
  content: z
    .string()
    .describe('The user-generated content to analyze.'),
  contentType: z
    .string()
    .describe('The type of content being analyzed (e.g., forum post, comment, article).'),
});
export type AnalyzeContentInput = z.infer<typeof AnalyzeContentInputSchema>;

export const AnalyzeContentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe('The overall sentiment of the content (e.g., positive, negative, neutral).'),
  keyTopics: z
    .array(z.string())
    .describe('A list of the key topics discussed in the content.'),
  suggestedImprovements: z
    .string()
    .describe('Suggestions for improving the content or generating similar content.'),
});
export type AnalyzeContentOutput = z.infer<typeof AnalyzeContentOutputSchema>;
