import { z } from 'zod';

export const PlaygroundSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  type: z.string(),
  coverImage: z.string().nullable(),
  coverImageHint: z.string().nullable(),
  surface: z.string(),
  features: z.array(z.string()),
  rating: z.number(),
  status: z.enum(['APPROVED', 'PENDING_MODERATION']),
  checkIns: z.number(),
  creator: z.object({
      name: z.string(),
      avatar: z.string().nullable(),
  })
});

export const FindVenuesInputSchema = z.object({
  query: z.string().describe('A natural language prompt describing the desired venue. e.g., "Хочу найти футбольное поле с хорошим освещением на вечер"')
});
export type FindVenuesInput = z.infer<typeof FindVenuesInputSchema>;

export const FindVenuesOutputSchema = z.object({
  summary: z.string().describe('A friendly, natural language summary of the findings, explaining why these venues were suggested.'),
  suggestedVenues: z.array(PlaygroundSchema).describe('A list of up to 5 suggested venues that fit the description.'),
});
export type FindVenuesOutput = z.infer<typeof FindVenuesOutputSchema>;
