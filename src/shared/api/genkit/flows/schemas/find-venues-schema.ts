import { z } from 'zod';

export const PlaygroundSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  type: z.string(),
  coverImage: z.string(),
  coverImageHint: z.string(),
  surface: z.string(),
  features: z.array(z.string()),
  rating: z.number(),
});

export const FindVenuesInputSchema = z.object({
  query: z.string().describe('A natural language prompt describing the desired venue. e.g., "Хочу найти футбольное поле с хорошим освещением на вечер"')
});
export type FindVenuesInput = z.infer<typeof FindVenuesInputSchema>;

export const FindVenuesOutputSchema = z.object({
  suggestedVenues: z.array(PlaygroundSchema).describe('A list of up to 5 suggested venues that fit the description.'),
});
export type FindVenuesOutput = z.infer<typeof FindVenuesOutputSchema>;
