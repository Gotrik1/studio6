'use server';
/**
 * @fileOverview An AI chatbot for team chats that can answer questions about the team.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getTeamData } from '@/lib/mock-data/team-data';

// --- Tools Definition ---

const getTeamSchedule = ai.defineTool(
    {
        name: 'getTeamSchedule',
        description: 'Получить расписание предстоящих матчей команды.',
        inputSchema: z.string().describe("ID команды, например, 'cyber-eagles'."),
        outputSchema: z.any(),
    },
    async (teamId) => {
        const data = getTeamData(teamId);
        return data?.schedule || [];
    }
);

const getMatchHistory = ai.defineTool(
    {
        name: 'getMatchHistory',
        description: 'Получить историю недавних матчей команды.',
        inputSchema: z.string().describe("ID команды, например, 'cyber-eagles'."),
        outputSchema: z.any(),
    },
    async (teamId) => {
        const data = getTeamData(teamId);
        return data?.matchHistory || [];
    }
);

const getTeamStats = ai.defineTool(
    {
        name: 'getTeamStats',
        description: 'Получить основную статистику команды.',
        inputSchema: z.string().describe("ID команды, например, 'cyber-eagles'."),
        outputSchema: z.any(),
    },
    async (teamId) => {
        const data = getTeamData(teamId);
        return data?.stats || {};
    }
);

// --- Flow Definition ---

export const TeamChatbotInputSchema = z.object({
  teamId: z.string().describe("ID команды, для которой выполняется запрос."),
  query: z.string().describe("Запрос пользователя к чат-боту."),
});
export type TeamChatbotInput = z.infer<typeof TeamChatbotInputSchema>;

export const TeamChatbotOutputSchema = z.string().describe("Ответ чат-бота на запрос.");
export type TeamChatbotOutput = z.infer<typeof TeamChatbotOutputSchema>;

const prompt = ai.definePrompt({
    name: 'teamChatbotPrompt',
    input: { schema: TeamChatbotInputSchema },
    output: { schema: TeamChatbotOutputSchema },
    tools: [getTeamSchedule, getMatchHistory, getTeamStats],
    system: `Ты — AI-помощник в командном чате платформы ProDvor. 
Твоя задача — отвечать на вопросы участников команды, используя доступные инструменты.
Всегда отвечай кратко, по делу и дружелюбно.
Чтобы использовать инструменты, тебе нужно знать ID команды. ID текущей команды: {{{teamId}}}.
`,
    prompt: `{{query}}`,
});


const teamChatbotFlow = ai.defineFlow(
  {
    name: 'teamChatbotFlow',
    inputSchema: TeamChatbotInputSchema,
    outputSchema: TeamChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || "Извините, я не смог обработать ваш запрос.";
  }
);

export async function askTeamChatbot(input: TeamChatbotInput): Promise<TeamChatbotOutput> {
    return teamChatbotFlow(input);
}
