'use server';

export type GenerateDashboardTipInput = {
    userName: string;
    lastActivity: string;
};

export type GenerateDashboardTipOutput = {
    tip: string;
};

export async function generateDashboardTip(input: GenerateDashboardTipInput): Promise<GenerateDashboardTipOutput> {
    const response = await fetch('/api/ai/generate-dashboard-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard tip');
    }
    return response.json();
}
