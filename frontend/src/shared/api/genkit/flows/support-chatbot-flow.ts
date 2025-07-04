'use server';
/**
 * @fileOverview An AI chatbot for user support, capable of answering questions based on an FAQ knowledge base.
 * - askSupportChatbot - a function that handles user queries.
 * - SupportChatbotInput - The input type for the function.
 * - SupportChatbotOutput - The return type for the function.
 */

import { ai } from '@genkit-ai/next';
import { z } from 'zod';
import { faqCategories } from '@/shared/lib/mock-data/faq';
import { SupportChatbotInputSchema, SupportChatbotOutputSchema } from './schemas/support-chatbot-schema';
import type { SupportChatbotInput, SupportChatbotOutput } from './schemas/support-chatbot-schema';

export type { SupportChatbotInput, SupportChatbotOutput };

// Tool to search the FAQ knowledge base
const searchFaq = ai.defineTool(
    {
        name: 'searchFaq',
        description: 'Searches the FAQ knowledge base for answers to user questions.',
        inputSchema: z.string().describe("The user's question or search query."),
        outputSchema: z.array(z.object({
            question: z.string(),
            answer: z.string(),
        })),
    },
    async (query) => {
        const lowercasedQuery = query.toLowerCase();
        const results: { question: string; answer: string }[] = [];

        faqCategories.forEach(category => {
            category.questions.forEach(faq => {
                if (
                    faq.q.toLowerCase().includes(lowercasedQuery) ||
                    faq.a.toLowerCase().includes(lowercasedQuery)
                ) {
                    results.push({ question: faq.q, answer: faq.a });
                }
            });
        });

        return results.slice(0, 3); // Return top 3 matches to the LLM
    }
);

// --- Flow Definition ---

const prompt = ai.definePrompt({
    name: 'supportChatbotPrompt',
    input: { schema: SupportChatbotInputSchema },
    output: { schema: SupportChatbotOutputSchema },
    tools: [searchFaq],
    system: `You are a friendly and helpful AI support assistant for the ProDvor platform.
Your goal is to answer user questions based on the information from the FAQ knowledge base.
1. Use the 'searchFaq' tool with the user's query to find relevant information.
2. If you find a relevant answer, provide it to the user in a clear and concise way.
3. If you cannot find a relevant answer in the FAQ, politely inform the user that you couldn't find an answer and suggest they use the contact form to reach a human support agent.
4. Always respond in Russian.`,
    prompt: `{{input}}`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || "Извините, у меня не получилось найти ответ. Пожалуйста, попробуйте переформулировать ваш вопрос или воспользуйтесь формой обратной связи.";
  }
);

export async function askSupportChatbot(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
    return supportChatbotFlow(input);
}
