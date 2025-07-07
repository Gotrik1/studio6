

'use server';

import type { Playground, PlaygroundReview, KingTeam } from '@/entities/playground/model/types';
import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';
import type { User as PrismaUser, Playground as PrismaPlayground, PlaygroundReview as PrismaPlaygroundReview } from '@prisma/client';

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

type RawReview = Omit<PrismaPlaygroundReview, 'author'> & { author: PrismaUser };

type RawPlayground = PrismaPlayground & {
    reviews: RawReview[];
    kingOfTheCourt?: KingTeam | null;
    creator: { name: string, avatar: string | null };
};

export async function getPlaygrounds(): Promise<Playground[]> {
  try {
    const result = await fetchWithAuth<Playground[]>('/playgrounds');
    if (!result.success || !result.data) {
      console.error('Failed to fetch playgrounds:', result.error);
      return [];
    }
    
    return result.data.map((p: Playground) => ({
      ...p,
      id: String(p.id),
      reviews: [], // Reviews aren't needed for the list view
      kingOfTheCourt: p.kingOfTheCourt,
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

    return {
        ...playground,
        id: String(playground.id),
        kingOfTheCourt: playground.kingOfTheCourt,
        reviews: (playground.reviews || []).map((review: RawReview) => ({
            id: String(review.id),
            rating: review.rating,
            comment: review.comment,
            timestamp: new Date(review.createdAt).toISOString(),
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
