import { z } from 'zod';

export const GenerateMatchInterviewInputSchema = z.object({
  matchSummary: z.string().describe("A summary of the match."),
  mvpName: z.string().describe("The name of the Most Valuable Player."),
});
export type GenerateMatchInterviewInput = z.infer<typeof GenerateMatchInterviewInputSchema>;

export const GenerateMatchInterviewOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio interview as a data URI in WAV format."),
  script: z.string().describe("The script of the interview."),
});
export type GenerateMatchInterviewOutput = z.infer<typeof GenerateMatchInterviewOutputSchema>;
