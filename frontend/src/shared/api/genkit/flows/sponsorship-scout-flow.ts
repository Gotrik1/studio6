'use server';

import type { SponsorshipScoutInput, SponsorshipScoutOutput } from './schemas/sponsorship-scout-schema';

export type { SponsorshipScoutInput, SponsorshipScoutOutput };

export async function sponsorshipScout(prompt: SponsorshipScoutInput): Promise<SponsorshipScoutOutput> {
    const response = await fetch('/api/ai/sponsorship-scout', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
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
