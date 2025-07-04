'use server';

import type { GenerateSponsorshipPitchInput, GenerateSponsorshipPitchOutput } from './schemas/generate-sponsorship-pitch-schema';

export type { GenerateSponsorshipPitchInput, GenerateSponsorshipPitchOutput };

export async function generateSponsorshipPitch(input: GenerateSponsorshipPitchInput): Promise<GenerateSponsorshipPitchOutput> {
   const response = await fetch('/api/ai/generate-sponsorship-pitch', {
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
