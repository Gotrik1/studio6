'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally
export type GeneratePostImageInput = string;
export type GeneratePostImageOutput = {
  imageDataUri: string;
};

export async function generatePostImage(prompt: GeneratePostImageInput): Promise<GeneratePostImageOutput> {
    const result = await fetchWithAuth<GeneratePostImageOutput>('/ai/generate-post-image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    });

    if (!result.success) {
        console.error("Backend API error:", result.error);
        throw new Error(`Backend API responded with status: ${result.status}`);
    }

    return result.data;
}
