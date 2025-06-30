
import { matchesList as mockMatches } from '@/shared/lib/mock-data/matches';
import type { Match } from '@/entities/match/model/types';


export async function fetchMatches(): Promise<Match[]> {
    // For now, it returns mock data. Later, it will make a real API call.
    console.log("Fetching matches... (returning mock data)");
    // Simulate network delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMatches;
}
