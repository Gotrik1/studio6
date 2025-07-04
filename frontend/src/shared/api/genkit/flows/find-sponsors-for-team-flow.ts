'use server';

import type { FindSponsorsForTeamInput, FindSponsorsForTeamOutput } from './schemas/find-sponsors-for-team-schema';
export type { FindSponsorsForTeamInput, FindSponsorsForTeamOutput };

export async function findSponsorsForTeam(input: FindSponsorsForTeamInput): Promise<FindSponsorsForTeamOutput> {
    const response = await fetch('/api/ai/find-sponsors-for-team', {
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
