import { z } from "zod";

export const GeneratePromotionDetailsInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A text prompt describing the promotion idea. e.g., "Скидка на игровые мыши от нашего бренда"',
    ),
});
export type GeneratePromotionDetailsInput = z.infer<
  typeof GeneratePromotionDetailsInputSchema
>;

export const GeneratePromotionDetailsOutputSchema = z.object({
  name: z
    .string()
    .describe("A creative and catchy name for the promotion or contest."),
  description: z
    .string()
    .describe("A short, exciting description for the promotion announcement."),
  prize: z.string().describe("A description of the prize for the winner(s)."),
});
export type GeneratePromotionDetailsOutput = z.infer<
  typeof GeneratePromotionDetailsOutputSchema
>;
