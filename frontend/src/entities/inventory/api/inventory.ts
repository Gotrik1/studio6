
'use server';

import type { InventoryItem } from '@/entities/inventory/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getInventory(): Promise<InventoryItem[]> {
    const result = await fetchWithAuth<InventoryItem[]>('/inventory', {
        next: { tags: ['inventory'] }
    });
    if (!result.success || !result.data) {
        console.error('Failed to fetch inventory:', result.error);
        return [];
    }
    return result.data.map((item: InventoryItem) => ({
        ...item,
        purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
    }));
}

export async function createInventoryItem(data: Omit<InventoryItem, 'id'>) {
    const result = await fetchWithAuth('/inventory', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (result.success) {
        revalidateTag('inventory');
    }
    
    return result;
}

export async function deleteInventoryItem(id: string) {
     const result = await fetchWithAuth(`/inventory/${id}`, {
        method: 'DELETE',
    });
    
    if (result.success) {
        revalidateTag('inventory');
    }
    
    return result;
}
