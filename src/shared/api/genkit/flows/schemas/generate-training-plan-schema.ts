import { z } from 'zod';

export const GenerateTrainingPlanInputSchema = z.object({
  analysis: z.object({
    strengths: z.array(z.string()).describe("Player's key strengths."),
    weaknesses: z.array(z.string()).describe("Player's key weaknesses."),
  }),
  playerRole: z.string().describe("The player's role in the game (e.g., Duelist, Support)."),
});
export type GenerateTrainingPlanInput = z.infer<typeof GenerateTrainingPlanInputSchema>;

export const GenerateTrainingPlanOutputSchema = z.object({
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
