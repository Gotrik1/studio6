"use server";

import { ai } from "../genkit";
import { z } from "zod";
import {
  SupportChatbotInputSchema,
  SupportChatbotOutputSchema,
} from "./schemas/support-chatbot-schema";
import type {
  SupportChatbotInput,
  SupportChatbotOutput,
} from "./schemas/support-chatbot-schema";
import { PrismaService } from "@/prisma/prisma.service";

const prisma = new PrismaService();

export type { SupportChatbotInput, SupportChatbotOutput };

export async function askSupportChatbot(
  input: SupportChatbotInput,
): Promise<SupportChatbotOutput> {
  return supportChatbotFlow_Backend(input);
}

const searchFaq_Backend = ai.defineTool(
  {
    name: "searchFaq_Backend",
    description:
      "Searches the FAQ knowledge base for answers to user questions.",
    inputSchema: z.string().describe("The user's question or search query."),
    outputSchema: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    const faqItems = await prisma.faqItem.findMany({
      where: {
        OR: [
          { question: { contains: lowercasedQuery, mode: "insensitive" } },
          { answer: { contains: lowercasedQuery, mode: "insensitive" } },
        ],
      },
      take: 3,
    });

    return faqItems.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
  },
);

const prompt_Backend = ai.definePrompt({
  name: "supportChatbotPrompt_Backend",
  input: { schema: SupportChatbotInputSchema },
  output: { schema: SupportChatbotOutputSchema },
  tools: [searchFaq_Backend],
  system: `You are a friendly and helpful AI support assistant for the ProDvor platform.
Your goal is to answer user questions based on the information from the FAQ knowledge base.
1. Use the 'searchFaq_Backend' tool with the user's query to find relevant information.
2. If you find a relevant answer, provide it to the user in a clear and concise way in the 'answer' field of the output object.
3. If you cannot find a relevant answer in the FAQ, politely inform the user that you couldn't find an answer and suggest they use the contact form to reach a human support agent.
4. Always respond in Russian.`,
  prompt: `{{input}}`,
});

const supportChatbotFlow_Backend = ai.defineFlow(
  {
    name: "supportChatbotFlow_Backend",
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt_Backend(input);
    return (
      output || {
        answer:
          "Извините, у меня не получилось найти ответ. Пожалуйста, попробуйте переформулировать ваш вопрос или воспользуйтесь формой обратной связи.",
      }
    );
  },
);
