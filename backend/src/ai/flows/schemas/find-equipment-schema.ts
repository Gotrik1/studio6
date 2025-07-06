import { z } from "zod";

export const StoreItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  imageHint: z.string(),
  category: z.string(),
  isRealMoney: z.boolean(),
});

export const FindEquipmentInputSchema = z
  .string()
  .describe(
    "A natural language query from a user looking for sports or gaming equipment.",
  );
export type FindEquipmentInput = z.infer<typeof FindEquipmentInputSchema>;

export const FindEquipmentOutputSchema = z.object({
  recommendations: z
    .array(StoreItemSchema)
    .describe(
      "A list of up to 3 recommended items from the store that best match the user's query.",
    ),
});
export type FindEquipmentOutput = z.infer<typeof FindEquipmentOutputSchema>;
