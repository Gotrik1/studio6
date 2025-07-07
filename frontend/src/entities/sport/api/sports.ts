
'use server';

import type { Sport } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export type { Sport };

export async function getSports(): Promise<Sport[]> {
    const result = await fetchWithAuth<Sport[]>('/sports', { next: { tags: ['sports'] } });
    if (!result.success || !result.data) {
        console.error("Failed to fetch sports:", result.error);
        return [];
    }
    return result.data;
}

export async function getSportById(id: string): Promise<Sport | null> {
    const result = await fetchWithAuth<Sport>(`/sports/${id}`);
    if (!result.success || !result.data) {
        console.error(`Failed to fetch sport ${id}:`, result.error);
        return null;
    }
    return result.data;
}


export async function createSport(data: Omit<Sport, 'id'>) {
    const result = await fetchWithAuth('/sports', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (result.success) {
        revalidateTag('sports');
    }
    return result;
}

export async function deleteSport(id: string) {
    const result = await fetchWithAuth(`/sports/${id}`, {
        method: 'DELETE',
    });
    if (result.success) {
        revalidateTag('sports');
    }
    return result;
}
