"use server";

/**
 * @fileOverview An AI agent for analyzing a match challenge and suggesting opponents and venues.
 *
 * - analyzeMatchChallenge - A function that handles the analysis.
 * - AnalyzeMatchChallengeInput - The input type for the function.
 * - AnalyzeMatchChallengeOutput - The return type for the function.
 */

import { ai } from "../genkit";
import { z } from "zod";
import { PrismaService } from "@/prisma/prisma.service";
import {
  AnalyzeMatchChallengeInputSchema,
  AnalyzeMatchChallengeOutputSchema,
  TeamSchema,
  VenueSchema,
} from "./schemas/analyze-match-challenge-schema";
import type {
  AnalyzeMatchChallengeInput,
  AnalyzeMatchChallengeOutput,
} from "./schemas/analyze-match-challenge-schema";

export type { AnalyzeMatchChallengeInput, AnalyzeMatchChallengeOutput };

const prisma = new PrismaService();

// Mock data access tools for the AI
const findOpponentTeams_Backend = ai.defineTool(
  {
    name: "findOpponentTeams_Backend",
    description:
      "Finds suitable opponent teams based on a query. Use this to find teams to play against.",
    inputSchema: z
      .string()
      .describe(
        "A query describing the desired opponent, e.g., 'сильная команда по футболу', 'команда новичков из Москвы'.",
      ),
    outputSchema: z.array(TeamSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    const teamsFromDb = await prisma.team.findMany({
      where: {
        OR: [
          { name: { contains: lowercasedQuery, mode: "insensitive" } },
          { game: { contains: lowercasedQuery, mode: "insensitive" } },
        ],
      },
      take: 20, // Fetch a bit more to filter down
    });

    const filteredTeams = teamsFromDb
      .filter((team) => {
        if (lowercasedQuery.includes("сильн") && (team.rank || 5) > 2)
          return false;
        if (lowercasedQuery.includes("новичк") && (team.rank || 0) <= 3)
          return false;
        return true;
      })
      .slice(0, 5); // Return top 5 matches to the LLM for reasoning

    return filteredTeams.map((t) => ({
      name: t.name,
      motto: t.motto || "Девиз не указан",
      logo: t.logo || "https://placehold.co/100x100.png",
      dataAiHint: t.dataAiHint || "team logo",
      rank: t.rank || 5,
      slug: t.slug,
    }));
  },
);

const findAvailableVenues_Backend = ai.defineTool(
  {
    name: "findAvailableVenues_Backend",
    description:
      "Finds available sports venues based on a query. Use this to find a place to play.",
    inputSchema: z
      .string()
      .describe(
        "A query describing the desired venue, e.g., 'футбольное поле в Москве', 'бесплатная баскетбольная площадка'.",
      ),
    outputSchema: z.array(VenueSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    const playgrounds = await prisma.playground.findMany({
      where: {
        status: "APPROVED", // Only show approved playgrounds
        OR: [
          { name: { contains: lowercasedQuery, mode: "insensitive" } },
          { address: { contains: lowercasedQuery, mode: "insensitive" } },
          { surface: { contains: lowercasedQuery, mode: "insensitive" } },
          { type: { contains: lowercasedQuery, mode: "insensitive" } },
        ],
      },
      take: 5,
    });

    return playgrounds.map((v) => ({
      id: v.id,
      name: v.name,
      address: v.address,
      surfaceType: v.surface,
      price: "Бесплатно", // Price is not in the schema, mock it for now.
      image: v.coverImage || "https://placehold.co/600x400.png",
      imageHint: v.coverImageHint || "sports playground",
    }));
  },
);

const prompt = ai.definePrompt({
  name: "analyzeMatchChallengePrompt_Backend",
  input: { schema: AnalyzeMatchChallengeInputSchema },
  output: { schema: AnalyzeMatchChallengeOutputSchema },
  tools: [findOpponentTeams_Backend, findAvailableVenues_Backend],
  prompt: `You are an intelligent matchmaker for the ProDvor platform.
A user wants to organize a match. Analyze their request and suggest the best opponents and venues using the provided tools.
- Use the \`findOpponentTeams_Backend\` tool to find a list of potential teams.
- Use the \`findAvailableVenues_Backend\` tool to find a list of potential venues.
- From the tool results, reason and select the top 3 most relevant teams and top 3 most relevant venues to return to the user.
- Ensure your suggestions are diverse and logical based on the user's request. For example, if they ask for a football match, only suggest football fields.
- Respond in Russian.

User Request: "{{{input}}}"
`,
});

const analyzeMatchChallengeFlow_Backend = ai.defineFlow(
  {
    name: "analyzeMatchChallengeFlow_Backend",
    inputSchema: AnalyzeMatchChallengeInputSchema,
    outputSchema: AnalyzeMatchChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);

export async function analyzeMatchChallenge(
  input: AnalyzeMatchChallengeInput,
): Promise<AnalyzeMatchChallengeOutput> {
  return analyzeMatchChallengeFlow_Backend(input);
}
