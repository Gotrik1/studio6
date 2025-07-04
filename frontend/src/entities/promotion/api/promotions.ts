'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { Promotion } from '../model/types';
import { revalidatePath } from 'next/cache';

export async function getPromotions(): Promise<Promotion[]> {
    const result = await fetchWithAuth('/promotions');
    if (!result.success) {
        console.error("Failed to fetch promotions:", result.error);
        return [];
    }
    return result.data;
}

export async function createPromotion(data: Omit<Promotion, 'id' | 'sponsor'>) {
    const result = await fetchWithAuth('/promotions', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (result.success) {
        revalidatePath('/promotions');
    }
    
    return result;
}
