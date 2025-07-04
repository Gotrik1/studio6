'use server';

import type { GenerateSocialMediaPostInput, GenerateSocialMediaPostOutput } from './schemas/generate-social-media-post-schema';

export type { GenerateSocialMediaPostInput, GenerateSocialMediaPostOutput };

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
    const response = await fetch('/api/ai/generate-social-media-post', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Backend API error:", errorBody);
        throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}
