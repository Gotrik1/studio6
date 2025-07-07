

'use server';

import type { KingTeam } from '@/entities/playground/model/types';
import { fetchWithAuth } from './api-client';


export async function getKingOfTheCourt(playgroundId: string): Promise<KingTeam | null> {
    const result = await fetchWithAuth<KingTeam>(`/playgrounds/${playgroundId}/king-of-the-court`);

    if (result.success) {
        return result.data as KingTeam | null;
    }

    console.error(`Failed to fetch king of the court for playground ${playgroundId}:`, result.error);
    return null;
}
