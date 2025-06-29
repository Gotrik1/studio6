import { z } from 'zod';

export const GeneratePostImageInputSchema = z.string().describe('A text description of the desired image, based on a social media post.');
export type GeneratePostImageInput = z.infer<typeof GeneratePostImageInputSchema>;

export const GeneratePostImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GeneratePostImageOutput = z.infer<typeof GeneratePostImageOutputSchema>;
