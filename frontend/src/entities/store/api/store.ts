'use server';

import type { StoreItem } from '../model/types';

export async function getStoreItems(): Promise<StoreItem[]> {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/store/items`, {
            cache: 'no-store', // For development, no cache
        });

        if (!res.ok) {
            console.error('Failed to fetch store items:', res.status, res.statusText);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching store items:', error);
        return [];
    }
}
