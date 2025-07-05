'use server';

export type GenerateDashboardTipInput = {
    userName: string;
    lastActivity: string;
};

export type GenerateDashboardTipOutput = {
    tip: string;
};

export async function generateDashboardTip(): Promise<GenerateDashboardTipOutput> {
    const response = await fetch('/api/ai/dashboard-tip', {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard tip');
    }
    return response.json();
}

    