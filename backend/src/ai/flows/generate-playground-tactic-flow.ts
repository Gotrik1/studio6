'use server';
/**
 * @fileOverview An AI agent for generating a team tactic for a specific playground.
 */

import { ai } from '../genkit';
import { GeneratePlaygroundTacticInputSchema, GeneratePlaygroundTacticOutputSchema } from './schemas/generate-playground-tactic-schema';
import type { GeneratePlaygroundTacticInput, GeneratePlaygroundTacticOutput } from './schemas/generate-playground-tactic-schema';

export type { GeneratePlaygroundTacticInput, GeneratePlaygroundTacticOutput };

export async function generatePlaygroundTactic(input: GeneratePlaygroundTacticInput): Promise<GeneratePlaygroundTacticOutput> {
  return generatePlaygroundTacticFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaygroundTacticPrompt_Backend',
  input: { schema: GeneratePlaygroundTacticInputSchema },
  output: { schema: GeneratePlaygroundTacticOutputSchema },
  prompt: `You are an expert sports and esports strategist. A team is looking for a tactic to use on a specific playground.

  Playground Details:
  - Type: {{{playgroundType}}}
  - Features: {{#each playgroundFeatures}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Team's Playstyle: "{{{teamPlaystyle}}}"

  Instructions:
  1.  Based on the playground's type and features, and the team's playstyle, devise a simple but effective tactic.
  2.  Give the tactic a catchy name.
  3.  Write a one-sentence description of the tactic's goal.
  4.  Provide 2-3 key points or steps for the team to execute the tactic successfully.
  
  Respond in Russian. The tone should be like a coach giving instructions.
  `,
});

const generatePlaygroundTacticFlow_Backend = ai.defineFlow(
  {
    name: 'generatePlaygroundTacticFlow_Backend',
    inputSchema: GeneratePlaygroundTacticInputSchema,
    outputSchema: GeneratePlaygroundTacticOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a tactic.");
    }
    return output;
  }
);
