import { z } from "zod";

export const OnboardingInputSchema = z.object({
  userName: z.string().describe("The name of the new user."),
  userRole: z
    .string()
    .describe(
      "The user's selected role on the platform (e.g., 'Игрок', 'Организатор', 'Капитан').",
    ),
});
export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;

const OnboardingSuggestionSchema = z.object({
  icon: z.enum(["User", "Users", "Gamepad2", "Trophy", "PlusCircle", "Search"]),
  title: z.string(),
  description: z.string(),
  href: z.string(),
  reward: z.string().optional(),
});

export const OnboardingOutputSchema = z.object({
  greeting: z
    .string()
    .describe("A warm, personalized welcome message for the user."),
  mainSuggestion: z
    .string()
    .describe(
      "A primary call to action or suggestion for the user based on their role.",
    ),
  suggestions: z
    .array(OnboardingSuggestionSchema)
    .describe(
      "An array of 2-3 concrete next steps or 'quests' for the user to complete.",
    ),
});
export type OnboardingOutput = z.infer<typeof OnboardingOutputSchema>;
