"use server";

/**
 * @fileOverview An AI scout for helping teams find suitable sponsors.
 *
 * - findSponsorsForTeam - A function that handles the scouting process.
 * - FindSponsorsForTeamInput - The input type for the function.
 * - FindSponsorsForTeamOutput - The return type for the function.
 */

import { ai } from "../genkit";
import { z } from "zod";
import { PrismaService } from "@/prisma/prisma.service";
import {
  FindSponsorsForTeamInputSchema,
  FindSponsorsForTeamOutputSchema,
  SponsorSchema,
} from "./schemas/find-sponsors-for-team-schema";
import type {
  FindSponsorsForTeamInput,
  FindSponsorsForTeamOutput,
} from "./schemas/find-sponsors-for-team-schema";

const prisma = new PrismaService();

export type { FindSponsorsForTeamInput, FindSponsorsForTeamOutput };

const findSponsorsTool_Backend = ai.defineTool(
  {
    name: "findSponsors_Backend",
    description: "Finds potential sponsors based on a query.",
    inputSchema: z
      .string()
      .describe(
        "A query to filter sponsors, e.g., 'energy drinks', 'gaming chairs'.",
      ),
    outputSchema: z.array(SponsorSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    // In a real app, this could use more sophisticated search like full-text or semantic.
    const sponsors = await prisma.sponsor.findMany({
      where: {
        OR: [
          { name: { contains: lowercasedQuery, mode: "insensitive" } },
          { description: { contains: lowercasedQuery, mode: "insensitive" } },
          { interests: { has: lowercasedQuery } },
        ],
      },
      take: 10,
    });

    return sponsors.map((s) => ({
      ...s,
      logo: s.logo || "",
      logoHint: s.logoHint || "sponsor logo",
    }));
  },
);

const prompt = ai.definePrompt({
  name: "findSponsorsForTeamPrompt_Backend",
  input: { schema: FindSponsorsForTeamInputSchema },
  output: { schema: FindSponsorsForTeamOutputSchema },
  tools: [findSponsorsTool_Backend],
  system: `You are an expert sports marketing agent for the ProDvor platform, helping teams find the perfect sponsors.
A team captain has described their team. Your task is to:
1.  Analyze the team's description, game, and needs.
2.  Use the \`findSponsors_Backend\` tool to get a list of available sponsors. Use keywords from the team's description to filter the tool's input.
3.  From the tool's results, select up to 3 sponsors that are the BEST fit for the team.
4.  For each recommended sponsor, provide a concise reasoning explaining why they are a good match for the team.
5.  Respond in Russian.`,
  prompt: `
Team Name: "{{{teamName}}}"
Game: "{{{teamGame}}}"
Team Description & Needs: "{{{teamDescription}}}"
`,
});

const findSponsorsForTeamFlow_Backend = ai.defineFlow(
  {
    name: "findSponsorsForTeamFlow_Backend",
    inputSchema: FindSponsorsForTeamInputSchema,
    outputSchema: FindSponsorsForTeamOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);

export async function findSponsorsForTeam(
  input: FindSponsorsForTeamInput,
): Promise<FindSponsorsForTeamOutput> {
  return findSponsorsForTeamFlow_Backend(input);
}
