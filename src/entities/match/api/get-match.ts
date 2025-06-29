import { matchData as mockMatchData } from '@/shared/lib/mock-data/match-details';
import type { MatchDetails } from '@/entities/match/model/types';


export const getMatchById = (id: string): MatchDetails | null => {
    // In a real app, you would fetch this from an API or database.
    if (id === mockMatchData.id) {
        return mockMatchData;
    }
    return null;
}
