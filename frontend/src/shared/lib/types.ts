export type User = {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    status?: 'ACTIVE' | 'BANNED';
    xp?: number;
    activitySummary?: string; // for AI analysis
    profileUrl?: string; // for search results
};
