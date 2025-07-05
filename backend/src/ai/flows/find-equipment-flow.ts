'use server';

/**
 * @fileOverview An AI agent for helping users find equipment in the store.
 *
 * - findEquipment - A function that handles the equipment search.
 * - FindEquipmentInput - The input type for the function.
 * - FindEquipmentOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { FindEquipmentInputSchema, FindEquipmentOutputSchema, StoreItemSchema } from './schemas/find-equipment-schema';
import type { FindEquipmentInput, FindEquipmentOutput } from './schemas/find-equipment-schema';
import { PrismaService } from '@/prisma/prisma.service';

const prisma = new PrismaService();

export type { FindEquipmentInput, FindEquipmentOutput };

const findItemsInStoreTool_Backend = ai.defineTool(
  {
    name: 'findItemsInStore_Backend',
    description: 'Searches the platform store for items based on a query.',
    inputSchema: z.string().describe("A query to filter items, e.g., 'игровая мышь', 'футбольные бутсы'."),
    outputSchema: z.array(StoreItemSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();
    
    const items = await prisma.storeItem.findMany({
        where: {
             OR: [
                { name: { contains: lowercasedQuery, mode: 'insensitive' } },
                { description: { contains: lowercasedQuery, mode: 'insensitive' } },
                { category: { contains: lowercasedQuery, mode: 'insensitive' } },
            ]
        },
        take: 5
    });

    return items.map(item => ({
        ...item,
        image: item.image || 'https://placehold.co/600x400.png',
        imageHint: item.imageHint || 'store item'
    }));
  }
);

const prompt = ai.definePrompt({
    name: 'findEquipmentPrompt_Backend',
    input: { schema: FindEquipmentInputSchema },
    output: { schema: FindEquipmentOutputSchema },
    tools: [findItemsInStoreTool_Backend],
    system: `You are an expert shop assistant for the ProDvor platform. A user is asking for equipment recommendations.
1.  Analyze the user's request.
2.  Use the \`findItemsInStore_Backend\` tool to get a list of relevant items from the store.
3.  From the tool's results, select up to 3 items that are the BEST fit for the user's request.
4.  Return the list of recommended items.
5.  Respond in Russian.`,
    prompt: `User Request: "{{{input}}}"`,
});

const findEquipmentFlow_Backend = ai.defineFlow(
  {
    name: 'findEquipmentFlow_Backend',
    inputSchema: FindEquipmentInputSchema,
    outputSchema: FindEquipmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function findEquipment(input: FindEquipmentInput): Promise<FindEquipmentOutput> {
  return findEquipmentFlow_Backend(input);
}
