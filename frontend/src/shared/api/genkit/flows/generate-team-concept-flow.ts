'use server';

/**
 * @fileOverview An API client for generating a complete team concept via the backend.
 *
 * - generateTeamConcept - A function that calls the backend to handle the generation.
 * - GenerateTeamConceptInput - The input type for the function.
 * - GenerateTeamConceptOutput - The return type for the function.
 */

import { GenerateTeamConceptInputSchema, GenerateTeamConceptOutputSchema } from './schemas/generate-team-concept-schema';
import type { GenerateTeamConceptInput, GenerateTeamConceptOutput } from './schemas/generate-team-concept-schema';

export type { GenerateTeamConceptInput, GenerateTeamConceptOutput };

export async function generateTeamConcept(input: GenerateTeamConceptInput): Promise<GenerateTeamConceptOutput> {
  // Validate input using Zod
  const parsedInput = GenerateTeamConceptInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for generating team concept.');
  }

  const response = await fetch(`/api/ai/generate-team-concept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: parsedInput.data.prompt }),
    // Important for Next.js to not cache API route results
    cache: 'no-store', 
  });

  if (!response.ok) {
    // You might want to handle different status codes differently
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  
  // Validate output
  const parsedOutput = GenerateTeamConceptOutputSchema.safeParse(result);
  if (!parsedOutput.success) {
      console.error("Invalid response from backend:", parsedOutput.error);
      throw new Error("Received invalid data structure from backend.");
  }
  
  return parsedOutput.data;
}
