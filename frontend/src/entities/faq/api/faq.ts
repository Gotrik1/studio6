
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export type FaqQuestion = {
    q: string;
    a: string;
};

export type FaqCategory = {
    title: string;
    value: string;
    questions: FaqQuestion[];
};

export async function getFaqCategories(): Promise<FaqCategory[]> {
    const result = await fetchWithAuth<FaqCategory[]>('/faq');
    if (!result.success || !result.data) {
        console.error("Failed to fetch FAQ:", result.error);
        return [];
    }
    return result.data;
}
