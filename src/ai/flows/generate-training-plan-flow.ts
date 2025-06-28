'use server';
/**
 * @fileOverview An AI agent for generating a personalized training plan for a player.
 *
 * - generateTrainingPlan - A function that handles the training plan generation.
 * - GenerateTrainingPlanInput - The input type for the function.
 * - GenerateTrainingPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateTrainingPlanInputSchema = z.object({
  analysis: z.object({
    strengths: z.array(z.string()).describe("Player's key strengths."),
    weaknesses: z.array(z.string()).describe("Player's key weaknesses."),
  }),
  playerRole: z.string().describe("The player's role in the game (e.g., Duelist, Support)."),
});
export type GenerateTrainingPlanInput = z.infer<typeof GenerateTrainingPlanInputSchema>;

const GenerateTrainingPlanOutputSchema = z.object({
  weeklyFocus: z.string().describe("The main area of focus for the week's training."),
  drills: z.array(z.object({
    name: z.string().describe("Name of the training drill."),
    description: z.string().describe("How to perform the drill and what its purpose is."),
    duration: z.string().describe("Suggested duration or frequency, e.g., '30 minutes daily', '3 games'."),
  })).describe("A list of specific drills or exercises."),
  suggestedVideos: z.array(z.object({
    title: z.string().describe("Title of the suggested video."),
    url: z.string().url().describe("A mock URL to a helpful video resource (e.g., YouTube)."),
  })).describe("Links to helpful video guides."),
  weeklyGoal: z.string().describe("A specific, measurable goal for the player to achieve this week."),
});
export type GenerateTrainingPlanOutput = z.infer<typeof GenerateTrainingPlanOutputSchema>;

export async function generateTrainingPlan(input: GenerateTrainingPlanInput): Promise<GenerateTrainingPlanOutput> {
  return generateTrainingPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrainingPlanPrompt',
  input: {schema: GenerateTrainingPlanInputSchema},
  output: {schema: GenerateTrainingPlanOutputSchema},
  prompt: `You are an expert esports coach. Based on the provided player analysis, create a personalized, actionable 1-week training plan. The plan should be concise and focus on improving the player's weaknesses while leveraging their strengths. The player's role is {{{playerRole}}}.

  Player Analysis:
  Strengths:
  {{#each analysis.strengths}}
  - {{this}}
  {{/each}}

  Weaknesses:
  {{#each analysis.weaknesses}}
  - {{this}}
  {{/each}}

  Generate a training plan with a clear weekly focus, specific drills, links to helpful (but fake) video guides, and a measurable goal for the week.
  `,
});

const generateTrainingPlanFlow = ai.defineFlow(
  {
    name: 'generateTrainingPlanFlow',
    inputSchema: GenerateTrainingPlanInputSchema,
    outputSchema: GenerateTrainingPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
