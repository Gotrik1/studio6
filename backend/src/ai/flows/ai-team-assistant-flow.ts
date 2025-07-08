
"use server";

import { ai } from "../genkit";
import { z } from "zod";
import { PrismaService } from "@/prisma/prisma.service";
import { AiTeamAssistantInputSchema, AiTeamAssistantOutputSchema } from "./schemas/ai-team-assistant-schema";
import type { AiTeamAssistantInput, AiTeamAssistantOutput } from "./schemas/ai-team-assistant-schema";

const prisma = new PrismaService();

export { AiTeamAssistantInput, AiTeamAssistantOutput };

export async function aiTeamAssistant(
  input: AiTeamAssistantInput,
): Promise<AiTeamAssistantOutput> {
  return aiTeamAssistantFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "aiTeamAssistantPrompt_Backend",
  input: {
    schema: z.object({
      teamGoals: z
        .string()
        .describe("The current goals and objectives of the team."),
      teamActivity: z
        .string()
        .describe("A summary of recent team activity and discussions."),
      relevantContent: z
        .string()
        .optional()
        .describe(
          "Any content that might be relevant to the team, such as documents or links.",
        ),
    }),
  },
  output: { schema: AiTeamAssistantOutputSchema },
  prompt: `Ты — AI-ассистент и стратегический советник для капитана команды. Твоя задача — проанализировать недавнюю активность команды и предоставить краткую, но содержательную сводку, а также предложить конкретные действия для улучшения координации и достижения целей.

Данные для анализа:
- Цели команды: {{{teamGoals}}}
- Активность команды (последние сообщения в чате, результаты матчей): {{{teamActivity}}}
{{#if relevantContent}}- Дополнительный контент (статьи, тактики): {{{relevantContent}}}{{/if}}

Сгенерируй:
1. Краткую сводку (Summary): Оцени общее настроение и выдели ключевые темы из обсуждений.
2. Рекомендации (Suggestions): Предложи 2-3 конкретных действия, которые капитан может предпринять (например, "провести собрание по тактике X" или "похвалить игрока Y за отличную игру").`,
});

const aiTeamAssistantFlow_Backend = ai.defineFlow(
  {
    name: "aiTeamAssistantFlow_Backend",
    inputSchema: AiTeamAssistantInputSchema,
    outputSchema: AiTeamAssistantOutputSchema,
  },
  async ({ teamId }) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        chat: {
          include: {
            messages: {
              take: 20,
              orderBy: { createdAt: "desc" },
              include: { author: { select: { name: true } } },
            },
          },
        },
        matchesAsTeam1: {
          where: { status: "FINISHED" },
          take: 3,
          orderBy: { finishedAt: "desc" },
          include: { team1: true, team2: true },
        },
        matchesAsTeam2: {
          where: { status: "FINISHED" },
          take: 3,
          orderBy: { finishedAt: "desc" },
          include: { team1: true, team2: true },
        },
      },
    });

    if (!team) {
      throw new Error(`Team with id ${teamId} not found.`);
    }

    const teamGoals = team.pitch || "Цели команды не установлены.";

    let teamActivity = "";

    // Add recent chat messages
    if (team.chat && team.chat.messages.length > 0) {
      teamActivity += "Последние сообщения в чате:\n";
      team.chat.messages.reverse().forEach((msg) => {
        teamActivity += `- ${msg.author.name}: ${msg.content}\n`;
      });
    } else {
      teamActivity += "В чате команды пока нет сообщений.\n";
    }

    // Add recent match results
    const allMatches = [...team.matchesAsTeam1, ...team.matchesAsTeam2]
      .sort(
        (a, b) =>
          (b.finishedAt?.getTime() || 0) - (a.finishedAt?.getTime() || 0),
      )
      .slice(0, 3);

    if (allMatches.length > 0) {
      teamActivity += "\nПоследние результаты матчей:\n";
      allMatches.forEach((match) => {
        const isTeam1 = match.team1Id === teamId;
        const opponentName = isTeam1 ? match.team2.name : match.team1.name;
        const teamScore = isTeam1 ? match.team1Score : match.team2Score;
        const opponentScore = isTeam1 ? match.team2Score : match.team1Score;
        let result: "Победа" | "Поражение" | "Ничья" = "Ничья";
        if (teamScore! > opponentScore!) result = "Победа";
        if (teamScore! < opponentScore!) result = "Поражение";

        teamActivity += `- ${result} ${teamScore}-${opponentScore} против ${opponentName}\n`;
      });
    }

    const { output } = await prompt({ teamGoals, teamActivity });
    return output!;
  },
);
