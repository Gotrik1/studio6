import { z } from "zod";

export const GenerateProfileBannerInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A text description of the desired banner image theme, e.g., "valorant esports", "street football".',
    ),
});
export type GenerateProfileBannerInput = z.infer<
  typeof GenerateProfileBannerInputSchema
>;

export const GenerateProfileBannerOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
});
export type GenerateProfileBannerOutput = z.infer<
  typeof GenerateProfileBannerOutputSchema
>;
