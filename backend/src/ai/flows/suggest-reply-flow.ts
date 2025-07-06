"use server";
/**
 * @fileOverview An AI agent for suggesting replies in a chat conversation.
 *
 * - suggestReply - A function that suggests chat replies.
 * - SuggestReplyInput - The input type for the suggestReply function.
 * - SuggestReplyOutput - The return type for the suggestReply function.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import {
  SuggestReplyInputSchema,
  SuggestReplyOutputSchema,
} from "./schemas/suggest-reply-schema";
import type {
  SuggestReplyInput,
  SuggestReplyOutput,
} from "./schemas/suggest-reply-schema";
import { PrismaService } from "@/prisma/prisma.service";

const prisma = new PrismaService();

export type { SuggestReplyInput, SuggestReplyOutput };

const getTeamInfo_Backend = ai.defineTool(
  {
    name: "getTeamInfo_Backend",
    description:
      "Gets information about a team, including their schedule and recent match results.",
    inputSchema: z
      .string()
      .describe("The ID of the team, for example 'dvotovyie-atlety'."),
    outputSchema: z.any(),
  },
  async (teamId) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) return "Команда не найдена";

    // --- Schedule ---
    const scheduleMatches = await prisma.match.findMany({
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
      take: 3,
    });
    const schedule = scheduleMatches.map((m) => ({
      opponent: m.team1Id === teamId ? m.team2.name : m.team1.name,
      date: m.scheduledAt.toISOString(),
      tournament: m.tournament?.name || "Товарищеский матч",
    }));

    // --- Match History ---
    const historyMatches = await prisma.match.findMany({
      where: {
        status: "FINISHED",
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
      },
      orderBy: { finishedAt: "desc" },
      take: 3,
    });
    const matchHistory = historyMatches.map((m) => {
      const isTeam1 = m.team1Id === teamId;
      const opponentName = isTeam1 ? m.team2.name : m.team1.name;
      const teamScore = isTeam1 ? m.team1Score : m.team2Score;
      const opponentScore = isTeam1 ? m.team2Score : m.team1Score;
      let result: "Победа" | "Поражение" | "Ничья" = "Ничья";
      if (teamScore! > opponentScore!) result = "Победа";
      if (teamScore! < opponentScore!) result = "Поражение";
      return {
        opponent: opponentName,
        result,
        score: `${m.team1Score}-${m.team2Score}`,
      };
    });

    // --- Stats ---
    const totalMatches = team.wins + team.losses + team.draws;
    const winRate =
      totalMatches > 0
        ? `${((team.wins / totalMatches) * 100).toFixed(0)}%`
        : "N/A";
    const stats = { winRate, rank: `#${team.rank}`, totalMatches };

    return { schedule, matchHistory, stats };
  },
);

export async function suggestReply(
  input: SuggestReplyInput,
): Promise<SuggestReplyOutput> {
  return suggestReplyFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "suggestReplyPrompt_Backend",
  input: { schema: SuggestReplyInputSchema },
  output: { schema: SuggestReplyOutputSchema },
  tools: [getTeamInfo_Backend],
  prompt: `You are an AI chat assistant. Your task is to generate exactly 3 concise and relevant reply suggestions for 'me'.
  The replies should be natural, appropriate for the context, and in Russian.

  If the conversation is about team activities (schedule, stats, matches), use the \`getTeamInfo_Backend\` tool with the provided \`teamId\` to get factual data.
  Base your suggestions on this data to provide helpful, informative replies.

  If no \`teamId\` is provided or the conversation is not about team activities, generate general conversational replies.

  Recent Chat History:
  {{{history}}}
  {{#if teamId}}
  Team ID for context: {{{teamId}}}
  {{/if}}
  `,
});

const suggestReplyFlow_Backend = ai.defineFlow(
  {
    name: "suggestReplyFlow_Backend",
    inputSchema: SuggestReplyInputSchema,
    outputSchema: SuggestReplyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
