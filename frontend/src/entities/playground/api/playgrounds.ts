
'use server';

import type { Playground } from '@/entities/playground/model/types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';

type CreatePlaygroundData = Omit<Playground, 'id' | 'rating' | 'checkIns' | 'status' | 'creator' | 'reviews'>;

export async function getPlaygrounds(): Promise<Playground[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/playgrounds`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch playgrounds');
    const playgrounds = await res.json();
    // Adapter to convert numeric ID to string
    return playgrounds.map((p: any) => ({
      ...p,
      id: String(p.id),
      reviews: [], // Reviews aren't needed for the list view
    }));
  } catch (error) {
    console.error('getPlaygrounds error:', error);
    return [];
  }
}

export async function getPlaygroundById(id: string): Promise<Playground | null> {
  try {
    const result = await fetchWithAuth(`/playgrounds/${id}`, {
        next: { tags: [`playground-${id}`] }
    });
    if (!result.success) {
        console.error(`Failed to fetch playground ${id}:`, result.error);
        return null;
    }
    const playground = result.data;
    if (playground) {
        // Adapter to convert numeric ID to string and format reviews
        return {
            ...playground,
            id: String(playground.id),
            reviews: (playground.reviews || []).map((review: any) => ({
                id: String(review.id),
                rating: review.rating,
                comment: review.comment,
                timestamp: review.createdAt,
                author: {
                    id: String(review.author.id),
                    name: review.author.name,
                    avatar: review.author.avatar,
                },
            }))
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
