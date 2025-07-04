'use server';

export type NewsItem = {
    title: string;
    summary: string;
    category: 'match' | 'team' | 'player' | 'platform';
    href: string;
};

export type NewsWithAudio = {
    news: NewsItem[];
    audioDataUri?: string;
};

export async function getDashboardNews(): Promise<NewsWithAudio> {
    const response = await fetch('/api/ai/dashboard-news', {
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard news');
    }
    return response.json();
}
