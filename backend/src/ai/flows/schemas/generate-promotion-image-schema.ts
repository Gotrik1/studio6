import { z } from "zod";

export const GeneratePromotionImageInputSchema = z
  .string()
  .describe("A text description of the desired promotion banner image.");
export type GeneratePromotionImageInput = z.infer<
  typeof GeneratePromotionImageInputSchema
>;

export const GeneratePromotionImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
});
export type GeneratePromotionImageOutput = z.infer<
  typeof GeneratePromotionImageOutputSchema
>;
