
import { allTournaments as mockTournaments } from '@/shared/lib/mock-data/tournaments';
import type { Tournament } from '@/entities/tournament/model/types';


export async function fetchTournaments(): Promise<Tournament[]> {
    // For now, it returns mock data. Later, it will make a real API call.
    console.log("Fetching tournaments... (returning mock data)");
    // Simulate network delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTournaments;
}
