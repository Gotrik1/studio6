import { z } from 'zod';

export const TeamChatbotInputSchema = z.object({
  teamId: z.string().describe("ID команды, для которой выполняется запрос."),
  query: z.string().describe("Запрос пользователя к чат-боту."),
});
export type TeamChatbotInput = z.infer<typeof TeamChatbotInputSchema>;

export const TeamChatbotOutputSchema = z.string().describe("Ответ чат-бота на запрос.");
export type TeamChatbotOutput = z.infer<typeof TeamChatbotOutputSchema>;
