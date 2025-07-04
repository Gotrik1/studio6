'use server';

// This file is the entrypoint for the Genkit development server.
import { config } from 'dotenv';
config();

// Import all flows to register them with Genkit.
import '@/shared/api/genkit/register-flows';
