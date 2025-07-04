'use server';

/**
 * @fileOverview An AI agent for helping users find equipment in the store.
 *
 * - findEquipment - A function that handles the equipment search.
 * - FindEquipmentInput - The input type for the function.
 * - FindEquipmentOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { storeItems } from '@/shared/lib/mock-data/store';
import { FindEquipmentInputSchema, FindEquipmentOutputSchema, StoreItemSchema } from './schemas/find-equipment-schema';
import type { FindEquipmentInput, FindEquipmentOutput } from './schemas/find-equipment-schema';

export type { FindEquipmentInput, FindEquipmentOutput };

const findItemsInStoreTool = ai.defineTool(
  {
    name: 'findItemsInStore',
    description: 'Searches the platform store for items based on a query.',
    inputSchema: z.string().describe("A query to filter items, e.g., 'игровая мышь', 'футбольные бутсы'."),
    outputSchema: z.array(StoreItemSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();
    return storeItems
      .filter(item =>
          item.name.toLowerCase().includes(lowercasedQuery) ||
          item.description.toLowerCase().includes(lowercasedQuery) ||
          item.category.toLowerCase().includes(lowercasedQuery)
      )
      .slice(0, 5); // Return up to 5 for the LLM to reason over
  }
);

const prompt = ai.definePrompt({
    name: 'findEquipmentPrompt',
    input: { schema: FindEquipmentInputSchema },
    output: { schema: FindEquipmentOutputSchema },
    tools: [findItemsInStoreTool],
    system: `You are an expert shop assistant for the ProDvor platform. A user is asking for equipment recommendations.
1.  Analyze the user's request.
2.  Use the \`findItemsInStore\` tool to get a list of relevant items from the store.
3.  From the tool's results, select up to 3 items that are the BEST fit for the user's request.
4.  Return the list of recommended items.
5.  Respond in Russian.`,
    prompt: `User Request: "{{{input}}}"`,
});

const findEquipmentFlow = ai.defineFlow(
  {
    name: 'findEquipmentFlow',
    inputSchema: FindEquipmentInputSchema,
    outputSchema: FindEquipmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function findEquipment(input: FindEquipmentInput): Promise<FindEquipmentOutput> {
  return findEquipmentFlow(input);
}
