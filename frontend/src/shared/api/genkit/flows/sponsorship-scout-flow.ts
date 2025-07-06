
'use server';

// Define types locally
export type TeamSchema = {
    slug: string;
    name: string;
    logo: string;
    logoHint: string;
    game: string;
    pitch: string;
    needs: string;
};

export type SponsorshipScoutInput = string;

export type SponsorshipScoutOutput = {
    recommendations: TeamSchema[];
    reasoning: string;
};

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
