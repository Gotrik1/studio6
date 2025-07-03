
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from the root .env file
config({ path: path.resolve(__dirname, '../../../../.env') });


export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
