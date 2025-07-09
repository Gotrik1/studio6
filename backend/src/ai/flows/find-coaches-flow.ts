"use server";

import { ai } from "../genkit";
import { z } from "zod";
import {
  FindCoachesInputSchema,
  FindCoachesOutputSchema,
  CoachSchema,
} from "./schemas/find-coaches-schema";
import type {
  FindCoachesInput,
  FindCoachesOutput,
} from "./schemas/find-coaches-schema";
import { PrismaService } from "@/prisma/prisma.service";
import { Role } from "@prisma/client";

const prisma = new PrismaService();

export type { FindCoachesInput, FindCoachesOutput };

// Tool to get coaches from the database
const findCoachesTool_Backend = ai.defineTool(
  {
    name: "findCoaches_Backend",
    description:
      "Finds coaches based on a query. Use this to search for coaches specializing in a specific game or skill.",
    inputSchema: z
      .string()
      .describe(
        "A query to filter coaches, e.g., 'тренер по Valorant', 'помощь с аимом', 'тактика в футболе'.",
      ),
    outputSchema: z.array(CoachSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    const coachesWithProfiles = await prisma.user.findMany({
      where: {
        role: Role.COACH,
        coachProfile: { isNot: null },
        OR: [
          { name: { contains: lowercasedQuery, mode: "insensitive" } },
          {
            coachProfile: {
              specialization: {
                contains: lowercasedQuery,
                mode: "insensitive",
              },
            },
          },
          {
            coachProfile: {
              description: { contains: lowercasedQuery, mode: "insensitive" },
            },
          },
          { coachProfile: { tags: { has: lowercasedQuery } } },
        ],
      },
      include: {
        coachProfile: true,
      },
      take: 10,
    });

    return coachesWithProfiles
      .filter((user) => user.coachProfile) // Ensure coachProfile exists
      .map((user) => ({
        id: user.coachProfile!.id,
        name: user.name,
        avatar: user.avatar || "https://placehold.co/100x100.png",
        avatarHint: "sports coach portrait",
        specialization: user.coachProfile!.specialization,
        description: user.coachProfile!.description,
        tags: user.coachProfile!.tags,
        experience: user.coachProfile!.experience,
        rating: user.coachProfile!.rating,
        price: user.coachProfile!.price.toString(),
        profileUrl: `/profiles/coach/${user.id}`,
      }))
      .slice(0, 5); // Return up to 5 for the LLM to reason over
  },
);

const prompt = ai.definePrompt({
  name: "findCoachesPrompt_Backend",
  input: { schema: FindCoachesInputSchema },
  output: { schema: FindCoachesOutputSchema },
  tools: [findCoachesTool_Backend],
  system: `You are an expert talent scout for the ProDvor platform, helping players find the perfect coach.
A player is looking for a coach. Your task is to:
1.  Analyze the player's request (their game, what they want to improve).
2.  Use the \`findCoaches_Backend\` tool to get a list of available coaches. Use keywords from the player's request to filter the tool's input.
3.  From the tool's results, select up to 3 coaches that are the BEST fit for the request.
4.  For each recommended coach, provide a concise reasoning explaining why they are a good match.
5.  Respond in Russian.`,
  prompt: `Player's Request: "{{{input}}}"`,
});

const findCoachesFlow_Backend = ai.defineFlow(
  {
    name: "findCoachesFlow_Backend",
    inputSchema: FindCoachesInputSchema,
    outputSchema: FindCoachesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);

export async function findCoaches(
  input: FindCoachesInput,
): Promise<FindCoachesOutput> {
  return findCoachesFlow_Backend(input);
}
