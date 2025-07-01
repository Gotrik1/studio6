'use server';

/**
 * @fileOverview An AI assistant for providing summaries of team activity and suggesting relevant content.
 *
 * - aiTeamAssistant - A function that handles the AI assistant process.
 * - AiTeamAssistantInput - The input type for the aiTeamAssistant function.
 * - AiTeamAssistantOutput - The return type for the aiTeamAssistant function.
 */

import {ai} from '@/shared/api/genkit';
import { AiTeamAssistantInputSchema, AiTeamAssistantOutputSchema } from './schemas/ai-team-assistant-schema';
import type { AiTeamAssistantInput, AiTeamAssistantOutput } from './schemas/ai-team-assistant-schema';

export type { AiTeamAssistantInput, AiTeamAssistantOutput };

export async function aiTeamAssistant(input: AiTeamAssistantInput): Promise<AiTeamAssistantOutput> {
  return aiTeamAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTeamAssistantPrompt',
  input: {schema: AiTeamAssistantInputSchema},
  output: {schema: AiTeamAssistantOutputSchema},
  prompt: `Ты — AI-ассистент и стратегический советник для капитана команды. Твоя задача — проанализировать недавнюю активность команды и предоставить краткую, но содержательную сводку, а также предложить конкретные действия для улучшения координации и достижения целей.

Данные для анализа:
- Цели команды: {{{teamGoals}}}
- Активность команды (последние сообщения в чате, результаты матчей): {{{teamActivity}}}
{{#if relevantContent}}- Дополнительный контент (статьи, тактики): {{{relevantContent}}}{{/if}}

Сгенерируй:
1. Краткую сводку (Summary): Оцени общее настроение и выдели ключевые темы из обсуждений.
2. Рекомендации (Suggestions): Предложи 2-3 конкретных действия, которые капитан может предпринять (например, "провести собрание по тактике X" или "похвалить игрока Y за отличную игру").`,
});

const aiTeamAssistantFlow = ai.defineFlow(
  {
    name: 'aiTeamAssistantFlow',
    inputSchema: AiTeamAssistantInputSchema,
    outputSchema: AiTeamAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
