import { z } from "zod";

const EventSchema = z.object({
  time: z.string(),
  event: z.string(),
  player: z.string(),
  team: z.string(),
});

export const GenerateMatchCommentaryInputSchema = z.object({
  team1Name: z.string(),
  team2Name: z.string(),
  events: z.array(EventSchema),
});
export type GenerateMatchCommentaryInput = z.infer<
  typeof GenerateMatchCommentaryInputSchema
>;

export const GenerateMatchCommentaryOutputSchema = z.object({
  commentaryScript: z
    .string()
    .describe(
      "An exciting play-by-play commentary script based on the match events.",
    ),
});
export type GenerateMatchCommentaryOutput = z.infer<
  typeof GenerateMatchCommentaryOutputSchema
>;
