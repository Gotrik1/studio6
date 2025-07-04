
import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { next } from '@genkit-ai/next';

// This creates the ai object that flows need to define prompts, tools, etc.
// All flows should import this 'ai' object.
export const ai = genkit({
  plugins: [
    googleAI(),
    next({
      // The Next.js dev server is running on port 9002
      port: 9003,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
