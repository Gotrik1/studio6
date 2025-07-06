"use server";

/**
 * @fileOverview An AI agent for generating a complete tournament concept from a single prompt.
 *
 * - generateTournamentWizard - A function that handles the generation.
 * - GenerateTournamentWizardInput - The input type for the function.
 * - GenerateTournamentWizardOutput - The return type for the function.
 */

import { ai } from "../genkit";
import { z } from "genkit";
import {
  GenerateTournamentWizardInputSchema,
  GenerateTournamentWizardOutputSchema,
} from "./schemas/generate-tournament-wizard-schema";
import type {
  GenerateTournamentWizardInput,
  GenerateTournamentWizardOutput,
} from "./schemas/generate-tournament-wizard-schema";

export type { GenerateTournamentWizardInput, GenerateTournamentWizardOutput };

export async function generateTournamentWizard(
  input: GenerateTournamentWizardInput,
): Promise<GenerateTournamentWizardOutput> {
  return generateTournamentWizardFlow_Backend(input);
}

// Internal function for image generation to avoid a separate flow call.
async function generateTournamentImage_internal(
  prompt: string,
): Promise<string> {
  const { media } = await ai.generate({
    model: "googleai/gemini-2.0-flash-preview-image-generation",
    prompt: `A professional and exciting sports tournament banner for a tournament about: ${prompt}. Epic, cinematic, digital art style.`,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  if (!media?.url) {
    throw new Error("Image generation failed.");
  }

  return media.url;
}

// A new, combined prompt to generate all text content at once.
const generateTournamentDetailsPrompt = ai.definePrompt({
  name: "generateTournamentAllDetailsPrompt",
  input: { schema: z.string() },
  output: {
    schema: z.object({
      name: z
        .string()
        .describe("A creative and exciting name for the tournament."),
      description: z
        .string()
        .describe(
          "A short, punchy description for the tournament announcement.",
        ),
      game: z
        .string()
        .describe(
          'The game or sport for the tournament, inferred from the prompt. E.g., "Valorant", "Футбол".',
        ),
      type: z
        .enum(["team", "individual"])
        .describe("The tournament type, inferred from the prompt."),
      format: z
        .enum(["single_elimination", "round_robin", "groups"])
        .describe("The tournament format, inferred from the prompt."),
      prizePool: z
        .string()
        .describe("A suggested prize pool structure with 3 tiers."),
      registrationEndDate: z
        .string()
        .describe(
          "Suggested registration end date in 'YYYY-MM-DD' format. It should be in the near future, e.g., one week from now.",
        ),
      tournamentStartDate: z
        .string()
        .describe(
          "Suggested tournament start date in 'YYYY-MM-DD' format. It should be after the registration end date.",
        ),
    }),
  },
  prompt: `You are an exciting esports and sports event organizer. Based on the following idea, generate a complete tournament concept. All output must be in Russian.
    
    Tournament Idea: {{{input}}}
    
    - Infer the game/sport from the idea.
    - Infer the type (team or individual).
    - Choose the most appropriate format (single_elimination, round_robin, or groups).
    - Generate a creative tournament name.
    - Write a short, punchy description for the tournament announcement.
    - Suggest a simple prize pool with 3 tiers (e.g., 1st, 2nd, 3rd place).
    - Provide a registration end date and a tournament start date in 'YYYY-MM-DD' format. The dates should be in the near future.
    `,
});

const generateTournamentWizardFlow_Backend = ai.defineFlow(
  {
    name: "generateTournamentWizardFlow_Backend",
    inputSchema: GenerateTournamentWizardInputSchema,
    outputSchema: GenerateTournamentWizardOutputSchema,
  },
  async ({ prompt }) => {
    // Generate all text details and the image in parallel
    const [detailsResult, imageDataUri] = await Promise.all([
      generateTournamentDetailsPrompt(prompt),
      generateTournamentImage_internal(prompt),
    ]);

    const detailsOutput = detailsResult.output;
    if (!detailsOutput) {
      throw new Error("Failed to generate tournament details.");
    }

    return {
      name: detailsOutput.name,
      description: detailsOutput.description,
      game: detailsOutput.game,
      type: detailsOutput.type,
      format: detailsOutput.format,
      imageDataUri,
      prizePool: detailsOutput.prizePool,
      registrationEndDate: detailsOutput.registrationEndDate,
      tournamentStartDate: detailsOutput.tournamentStartDate,
    };
  },
);
