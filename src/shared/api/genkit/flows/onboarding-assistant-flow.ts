'use server';
/**
 * @fileOverview An AI assistant for onboarding new users.
 *
 * - getOnboardingSuggestions - A function that handles generating personalized onboarding steps.
 * - OnboardingInput - The input type for the function.
 * - OnboardingOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { OnboardingInputSchema, OnboardingOutputSchema } from './schemas/onboarding-assistant-schema';
import type { OnboardingInput, OnboardingOutput } from './schemas/onboarding-assistant-schema';

export type { OnboardingInput, OnboardingOutput };

export async function getOnboardingSuggestions(input: OnboardingInput): Promise<OnboardingOutput> {
  return onboardingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'onboardingAssistantPrompt',
  input: {schema: OnboardingInputSchema},
  output: {schema: OnboardingOutputSchema},
  prompt: `You are a friendly and helpful onboarding assistant for the "ProDvor" esports platform.
A new user, {{userName}}, has just signed up with the role of "{{userRole}}".

Your task is to provide a warm welcome and a personalized set of first steps to help them get started.

1.  **Greeting**: Write a short, friendly welcome message addressed to {{userName}}.
2.  **Main Suggestion**: Based on their role, provide a primary call to action. For example, for a "Игрок" or "Капитан", suggest finding or creating a team. For an "Организатор", suggest creating a tournament.
3.  **Suggestions (Quests)**: Generate a list of 2-3 simple, actionable next steps. Each suggestion should have a title, a short description, a relevant icon name from the provided enum, a link (href), and an optional reward in PD (e.g., "+25 PD").

Here are some example links you can use:
- Profile: /profile
- Teams: /teams
- Tournaments: /tournaments
- Create Team: /teams/new
- Create Tournament: /tournaments/new

Respond in Russian.

Example for a 'Капитан':
- Greeting: "Добро пожаловать, {{userName}}!"
- Main Suggestion: "Как капитан, ваш первый шаг — собрать команду. Давайте создадим её!"
- Suggestions:
    - { icon: 'Users', title: 'Создать команду', description: 'Соберите свой состав и начните путь к славе.', href: '/teams/new', reward: '+50 PD' }
    - { icon: 'User', title: 'Заполнить профиль', description: 'Полный профиль повышает доверие и привлекает игроков.', href: '/profile', reward: '+15 PD' }
    - { icon: 'Trophy', title: 'Найти турнир', description: 'Осмотритесь и найдите подходящие соревнования для вашей будущей команды.', href: '/tournaments' }
`,
});

const onboardingAssistantFlow = ai.defineFlow(
  {
    name: 'onboardingAssistantFlow',
    inputSchema: OnboardingInputSchema,
    outputSchema: OnboardingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
