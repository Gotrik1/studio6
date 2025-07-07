
'use server';

import type { StoreItem } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getStoreItems(): Promise<StoreItem[]> {
    const result = await fetchWithAuth<StoreItem[]>('/store/items');
    if (!result.success) {
        console.error('Failed to fetch store items:', result.error);
        return [];
    }
    return result.data;
}
