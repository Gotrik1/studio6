
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// This creates the ai object that flows need to define prompts, tools, etc.
// All flows should import this 'ai' object.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
