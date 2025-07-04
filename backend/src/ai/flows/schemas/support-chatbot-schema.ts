import { z } from 'zod';

export const SupportChatbotInputSchema = z.string().describe("User's question for the support chatbot.");
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

export const SupportChatbotOutputSchema = z.object({
  answer: z.string().describe("The chatbot's answer."),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;
