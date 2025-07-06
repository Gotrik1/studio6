import { z } from "zod";

export const GeneratePromotionWizardInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A simple text prompt describing the promotion idea, e.g., "Конкурс на лучший скриншот".',
    ),
});
export type GeneratePromotionWizardInput = z.infer<
  typeof GeneratePromotionWizardInputSchema
>;

export const GeneratePromotionWizardOutputSchema = z.object({
  name: z.string().describe("The generated name of the promotion."),
  description: z
    .string()
    .describe("A short, exciting description for the promotion announcement."),
  prize: z.string().describe("A description of the prize for the winner(s)."),
  imageDataUri: z
    .string()
    .describe("The generated promotion banner image as a data URI."),
  cost: z
    .string()
    .describe(
      "A suggested cost in PD for participation, e.g., '50' or '0' for free.",
    ),
});
export type GeneratePromotionWizardOutput = z.infer<
  typeof GeneratePromotionWizardOutputSchema
>;
