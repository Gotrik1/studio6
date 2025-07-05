
'use server';

import type { Playground } from '@/entities/playground/model/types';
import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';

type CreatePlaygroundData = Omit<Playground, 'id' | 'rating' | 'checkIns' | 'status' | 'creator'>;

export async function getPlaygrounds(): Promise<Playground[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/playgrounds`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch playgrounds');
    const playgrounds = await res.json();
    // Adapter to convert numeric ID to string
    return playgrounds.map((p: any) => ({
      ...p,
      id: String(p.id),
    }));
  } catch (error) {
    console.error('getPlaygrounds error:', error);
    return [];
  }
}

export async function getPlaygroundById(id: string): Promise<Playground | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/playgrounds/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        console.error(`Failed to fetch playground ${id}:`, res.statusText);
        return null;
    };
    const playground = await res.json();
    if (playground) {
        // Adapter to convert numeric ID to string
        return {
            ...playground,
            id: String(playground.id),
        };
    }
    return null;
  } catch (error) {
    console.error(`getPlaygroundById error for id ${id}:`, error);
    return null;
  }
}

export async function createPlayground(data: CreatePlaygroundData) {
    const result = await fetchWithAuth('/playgrounds', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (result.success) {
        revalidatePath('/playgrounds');
    }
    
    return result;
}
