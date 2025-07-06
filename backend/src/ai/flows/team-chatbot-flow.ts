"use server";
/**
 * @fileOverview An AI chatbot for team chats that can answer questions about the team.
 */
import { ai } from "../genkit";
import { z } from "zod";
import {
  TeamChatbotInputSchema,
  TeamChatbotOutputSchema,
} from "./schemas/team-chatbot-schema";
import type {
  TeamChatbotInput,
  TeamChatbotOutput,
} from "./schemas/team-chatbot-schema";
import { PrismaService } from "@/prisma/prisma.service";

const prisma = new PrismaService();

export type { TeamChatbotInput, TeamChatbotOutput };

// --- Tools Definition ---

const getTeamSchedule_Backend = ai.defineTool(
  {
    name: "getTeamSchedule_Backend",
    description: "Получить расписание предстоящих матчей команды.",
    inputSchema: z
      .string()
      .describe("ID команды, например, 'dvotovyie-atlety'."),
    outputSchema: z.any(),
  },
  async (teamId) => {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return "Команда не найдена";

    const matches = await prisma.match.findMany({
      where: {
        status: "PLANNED",
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
        tournament: { select: { name: true } },
      },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    });

    if (matches.length === 0) {
      return "У команды нет запланированных матчей.";
    }

    return matches.map((m) => ({
      opponent: m.team1Id === teamId ? m.team2.name : m.team1.name,
      date: m.scheduledAt.toISOString(),
      tournament: m.tournament?.name || "Товарищеский матч",
    }));
  },
);

const getMatchHistory_Backend = ai.defineTool(
  {
    name: "getMatchHistory_Backend",
    description: "Получить историю недавних матчей команды.",
    inputSchema: z
      .string()
      .describe("ID команды, например, 'dvotovyie-atlety'."),
    outputSchema: z.any(),
  },
  async (teamId) => {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return "Команда не найдена";

    const matches = await prisma.match.findMany({
      where: {
        status: "FINISHED",
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
      },
      orderBy: { finishedAt: "desc" },
      take: 5,
    });

    if (matches.length === 0) {
      return "Команда еще не играла матчей.";
    }

    return matches.map((m) => {
      const isTeam1 = m.team1Id === teamId;
      const opponentName = isTeam1 ? m.team2.name : m.team1.name;
      const teamScore = isTeam1 ? m.team1Score : m.team2Score;
      const opponentScore = isTeam1 ? m.team2Score : m.team1Score;

      let result: "Победа" | "Поражение" | "Ничья" = "Ничья";
      if (teamScore! > opponentScore!) result = "Победа";
      if (teamScore! < opponentScore!) result = "Поражение";

      return {
        opponent: opponentName,
        result: result,
        score: `${m.team1Score}-${m.team2Score}`,
      };
    });
  },
);

const getTeamStats_Backend = ai.defineTool(
  {
    name: "getTeamStats_Backend",
    description: "Получить основную статистику команды.",
    inputSchema: z
      .string()
      .describe("ID команды, например, 'dvotovyie-atlety'."),
    outputSchema: z.any(),
  },
  async (teamId) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) return "Команда не найдена";

    const totalMatches = team.wins + team.losses + team.draws;
    const winRate =
      totalMatches > 0
        ? `${((team.wins / totalMatches) * 100).toFixed(0)}%`
        : "N/A";

    return {
      winRate,
      rank: `#${team.rank}`,
      totalMatches,
      wins: team.wins,
      losses: team.losses,
      draws: team.draws,
    };
  },
);

// --- Flow Definition ---
const prompt = ai.definePrompt({
  name: "teamChatbotPrompt_Backend",
  input: { schema: TeamChatbotInputSchema },
  output: { schema: TeamChatbotOutputSchema },
  tools: [
    getTeamSchedule_Backend,
    getMatchHistory_Backend,
    getTeamStats_Backend,
  ],
  system: `Ты — AI-помощник в командном чате платформы ProDvor. 
Твоя задача — отвечать на вопросы участников команды, используя доступные инструменты.
Всегда отвечай кратко, по делу и дружелюбно.
Чтобы использовать инструменты, тебе нужно знать ID команды. ID текущей команды: {{{teamId}}}.
`,
  prompt: `{{query}}`,
});

const teamChatbotFlow_Backend = ai.defineFlow(
  {
    name: "teamChatbotFlow_Backend",
    inputSchema: TeamChatbotInputSchema,
    outputSchema: TeamChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || "Извините, я не смог обработать ваш запрос.";
  },
);

export async function askTeamChatbot(
  input: TeamChatbotInput,
): Promise<TeamChatbotOutput> {
  return teamChatbotFlow_Backend(input);
}
