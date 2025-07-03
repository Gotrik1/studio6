
import { z } from 'zod';

export const GenerateTeamAvatarInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired avatar image.'),
});
export type GenerateTeamAvatarInput = z.infer<typeof GenerateTeamAvatarInputSchema>;

export const GenerateTeamAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateTeamAvatarOutput = z.infer<typeof GenerateTeamAvatarOutputSchema>;
