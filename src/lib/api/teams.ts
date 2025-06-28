
import { teams as mockTeams } from '@/lib/mock-data/teams';

// Define the Team type based on the mock data structure
export type Team = (typeof mockTeams)[0];

export async function fetchTeams(): Promise<Team[]> {
    // For now, it returns mock data. Later, it will make a real API call.
    console.log("Fetching teams... (returning mock data)");
    // Simulate network delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTeams;
}
