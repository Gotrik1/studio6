'use server';

// Define types locally to decouple from backend schemas.
export type AiTeamAssistantInput = {
    teamActivity: string;
    teamGoals: string;
    relevantContent?: string;
};

export type AiTeamAssistantOutput = {
    summary: string;
    suggestions: string[];
};

export async function aiTeamAssistant(input: AiTeamAssistantInput): Promise<AiTeamAssistantOutput> {
    const response = await fetch('/api/ai/ai-team-assistant', {
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
