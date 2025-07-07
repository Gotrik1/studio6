
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Types are defined locally to decouple from backend schemas.
export type GenerateSocialMediaPostInput = {
    teamName: string;
    postType: 'match_announcement' | 'player_highlight' | 'general_update';
    context: string;
};

export type GenerateSocialMediaPostOutput = {
    postText: string;
    hashtags: string[];
    imageDataUri: string;
};

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
    const response = await fetchWithAuth<GenerateSocialMediaPostOutput>('/ai/generate-social-media-post', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        cache: 'no-store',
    });

    if (!response.success) {
        console.error("Backend API error:", response.error);
        throw new Error(response.error || `Backend API responded with status: ${response.status}`);
    }

    return response.data;
}
