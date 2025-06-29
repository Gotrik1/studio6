import { z } from 'zod';

export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  surfaceType: z.string(),
  price: z.string(),
  image: z.string(),
  imageHint: z.string(),
  features: z.array(z.string()),
  rating: z.number(),
});

export const FindVenuesInputSchema = z.string().describe('A natural language prompt describing the desired venue. e.g., "Хочу найти футбольное поле с хорошим освещением на вечер"');
export type FindVenuesInput = z.infer<typeof FindVenuesInputSchema>;

export const FindVenuesOutputSchema = z.object({
  suggestedVenues: z.array(VenueSchema).describe('A list of up to 5 suggested venues that fit the description.'),
});
export type FindVenuesOutput = z.infer<typeof FindVenuesOutputSchema>;
