import { z } from 'zod';

const GenerateUserAvatarInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired avatar image.'),
});
export type GenerateUserAvatarInput = z.infer<typeof GenerateUserAvatarInputSchema>;

const GenerateUserAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateUserAvatarOutput = z.infer<typeof GenerateUserAvatarOutputSchema>;
