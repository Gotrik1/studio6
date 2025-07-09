"use server";

import { ai } from "../genkit";
import { z } from "zod";
import {
  PlayerScoutInputSchema,
  PlayerScoutOutputSchema,
  PlayerProfileSchema,
} from "./schemas/player-scout-schema";
import type {
  PlayerScoutInput,
  PlayerScoutOutput,
} from "./schemas/player-scout-schema";
import { PrismaService } from "@/prisma/prisma.service";
import { Role } from "@prisma/client";

const prisma = new PrismaService();

export type { PlayerScoutInput, PlayerScoutOutput };

const findPlayersTool_Backend = ai.defineTool(
  {
    name: "findPlayersTool_Backend",
    description:
      "Finds players based on a query, including role, playstyle, or availability.",
    inputSchema: z
      .string()
      .describe(
        "A query to filter players, e.g., 'Нападающий', 'спокойный стиль', 'Valorant'.",
      ),
    outputSchema: z.array(PlayerProfileSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    // In a real app, this would use more sophisticated search like full-text or semantic.
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: lowercasedQuery, mode: "insensitive" } },
          { mainSport: { contains: lowercasedQuery, mode: "insensitive" } },
        ],
        // Exclude administrative roles from regular player scouting
        role: { notIn: [Role.ADMINISTRATOR, Role.MODERATOR, Role.JUDGE] },
      },
      take: 10, // Limit results to LLM
    });

    return users.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      avatar: p.avatar || "https://placehold.co/100x100.png",
      profileUrl: `/profiles/player/${p.id}`,
      statsSummary: `Роль: ${p.role}. Основной вид спорта: ${p.mainSport || "не указан"}.`,
    }));
  },
);

const prompt = ai.definePrompt({
  name: "playerScoutPrompt_Backend",
  input: { schema: PlayerScoutInputSchema },
  output: { schema: PlayerScoutOutputSchema },
  tools: [findPlayersTool_Backend],
  system: `You are an expert esports scout. A team captain is looking for a new player.
1.  Analyze the captain's request.
2.  Use the \`findPlayersTool_Backend\` tool to get a list of available players.
3.  From the tool's results, select up to 5 players that are the BEST fit for the request.
4.  For each recommended player, provide a concise reasoning explaining why they are a good match.
5.  Respond in Russian.`,
  prompt: `Captain's Request: "{{{input}}}"`,
});

const playerScoutFlow_Backend = ai.defineFlow(
  {
    name: "playerScoutFlow_Backend",
    inputSchema: PlayerScoutInputSchema,
    outputSchema: PlayerScoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);

export async function playerScout(
  input: PlayerScoutInput,
): Promise<PlayerScoutOutput> {
  return playerScoutFlow_Backend(input);
}
