

'use server';

import type { Playground, PlaygroundReview, KingTeam } from '@/entities/playground/model/types';
import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';
import type { User } from '@prisma/client';

/**
 * Explicit DTO for creating a playground.
 * This ensures the contract with the backend API is clear and consistent.
 */
export type CreatePlaygroundData = {
    name: string;
    address: string;
    type: string;
    surface: string;
    features: string[];
    coverImage?: string;
    coverImageHint?: string;
};

type RawPlayground = Omit<Playground, 'reviews' | 'kingOfTheCourt'> & {
    reviews: (Omit<PlaygroundReview, 'author'> & { author: User })[];
    kingOfTheCourt?: KingTeam | null;
}

export async function getPlaygrounds(): Promise<Playground[]> {
  try {
    const result = await fetchWithAuth<Playground[]>('/playgrounds');
    if (!result.success || !result.data) {
      console.error('Failed to fetch playgrounds:', result.error);
      return [];
    }
    
    // Adapter to convert numeric ID to string
    return result.data.map((p: Playground) => ({
      ...p,
      id: String(p.id),
      reviews: [], // Reviews aren't needed for the list view
      kingOfTheCourt: p.kingOfTheCourt, // Pass through new data
    }));
  } catch (error) {
    console.error('getPlaygrounds error:', error);
    return [];
  }
}

export async function getPlaygroundById(id: string): Promise<Playground | null> {
  try {
    const result = await fetchWithAuth<RawPlayground>(`/playgrounds/${id}`, {
        next: { tags: [`playground-${id}`] }
    });
    if (!result.success || !result.data) {
        console.error(`Failed to fetch playground ${id}:`, result.error);
        return null;
    }
    const playground = result.data;

    // Adapter to convert numeric ID to string and format reviews
    return {
        ...playground,
        id: String(playground.id),
        kingOfTheCourt: playground.kingOfTheCourt, // Pass through new data
        reviews: (playground.reviews || []).map((review) => ({
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
