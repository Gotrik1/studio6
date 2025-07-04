'use server';

// This file is the entrypoint for the Genkit development server.
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from the root .env file
config({ path: path.resolve(__dirname, '../../../.env') });


// Import all flows to register them with Genkit.
import '@/shared/api/genkit/register-flows';
