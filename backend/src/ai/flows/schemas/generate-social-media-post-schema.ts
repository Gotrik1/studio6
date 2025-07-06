import { z } from "zod";

export const GenerateSocialMediaPostInputSchema = z.object({
  teamName: z.string().describe("The name of the team."),
  postType: z
    .enum(["match_announcement", "player_highlight", "general_update"])
    .describe("The type of post to generate."),
  context: z
    .string()
    .describe(
      "Context for the post, e.g., 'Upcoming match against Team Rival at 8 PM' or 'Highlighting our star player, Sonic, for their amazing performance.'",
    ),
});
export type GenerateSocialMediaPostInput = z.infer<
  typeof GenerateSocialMediaPostInputSchema
>;

export const GenerateSocialMediaPostOutputSchema = z.object({
  postText: z
    .string()
    .describe("The generated text for the social media post."),
  hashtags: z.array(z.string()).describe("A list of 3-5 relevant hashtags."),
  imageDataUri: z
    .string()
    .describe("The generated image for the post as a data URI."),
});
export type GenerateSocialMediaPostOutput = z.infer<
  typeof GenerateSocialMediaPostOutputSchema
>;
