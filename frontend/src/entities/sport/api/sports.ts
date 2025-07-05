'use server';

import type { Sport } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getSports(): Promise<Sport[]> {
    const result = await fetchWithAuth('/sports');
    if (!result.success) {
        console.error("Failed to fetch sports:", result.error);
        return [];
    }
    return result.data;
}

export async function getSportById(id: string): Promise<Sport | null> {
    const result = await fetchWithAuth(`/sports/${id}`);
    if (!result.success) {
        console.error(`Failed to fetch sport ${id}:`, result.error);
        return null;
    }
    return result.data;
}
