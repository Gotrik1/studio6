'use server';

// This file is the client for the backend AI flow.
// It is NOT a Genkit flow itself.

// Define types locally to decouple from backend schemas.
export type AnalyzeRoleChangeInput = {
    userName: string;
    currentRole: string;
    requestedRole: string;
    activitySummary: string;
};

export type AnalyzeRoleChangeOutput = {
    recommendation: 'approve' | 'deny' | 'caution';
    reasoning: string;
    confidence: 'high' | 'medium' | 'low';
};

export async function analyzeRoleChange(input: AnalyzeRoleChangeInput): Promise<AnalyzeRoleChangeOutput> {
    const response = await fetch('/api/ai/analyze-role-change', {
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
