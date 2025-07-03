import { teams as mockTeams } from '@/shared/lib/mock-data/teams';
import type { Team } from '@/entities/team/model/types';


export async function fetchTeams(): Promise<Team[]> {
    // For now, it returns mock data. Later, it will make a real API call.
    console.log("Fetching teams... (returning mock data)");
    // Simulate network delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTeams;
}
