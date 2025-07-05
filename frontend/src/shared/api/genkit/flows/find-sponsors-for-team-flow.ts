'use server';

// Define types locally to decouple from backend schemas.
export type Sponsor = {
    id: string;
    name: string;
    logo: string;
    logoHint: string;
    description: string;
    profileUrl: string;
    interests: string[];
};

export type FindSponsorsForTeamInput = {
  teamName: string;
  teamGame: string;
  teamDescription: string;
};

export type FindSponsorsForTeamOutput = {
    recommendations: {
        sponsor: Sponsor;
        reasoning: string;
    }[];
};

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
