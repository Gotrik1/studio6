

'use server';

import type { Team, TeamDetails } from '@/entities/team/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidatePath } from 'next/cache';
import type { AnalyzeTeamPerformanceOutput } from '@/shared/api/genkit/flows/analyze-team-performance-flow';

export type { Team, TeamDetails };

export async function getTeams(): Promise<Team[]> {
  const result = await fetchWithAuth<Team[]>('/teams');
  if (!result.success) {
    console.error('Failed to fetch teams from backend:', result.error);
    return []; // Return empty array on failure
  }
  
  // Adapter to ensure data conforms to the frontend Team type
  if (Array.isArray(result.data)) {
    return result.data.map((team: Team) => ({
      id: String(team.id), // Ensure ID is always a string
      name: team.name,
      motto: team.motto,
      logo: team.logo || 'https://placehold.co/100x100.png',
      dataAiHint: team.dataAiHint || 'team logo',
      game: team.game,
      rank: team.rank,
      members: team.members,
      captain: team.captain,
      slug: team.slug,
      homePlaygroundId: team.homePlaygroundId,
    }));
  }

  return [];
}
export async function getTeamBySlug(slug: string): Promise<TeamDetails | null> {
    const result = await fetchWithAuth<TeamDetails>(`/teams/slug/${slug}`, {
        cache: 'no-store',
    });

    if (!result.success) {
        console.error(`Failed to fetch team by slug ${slug}:`, result.error);
        return null; // Handle 404 or other errors gracefully
    }
    
    const rawTeamData = result.data;
    if (!rawTeamData) {
        return null;
    }

    return rawTeamData;
}


export async function setHomePlayground(teamId: string, playgroundId: string) {
    const result = await fetchWithAuth<Team>(`/teams/${teamId}/home-playground`, {
        method: 'PATCH',
        body: JSON.stringify({ playgroundId }),
    });

    if (result.success) {
        // Revalidate the team page to show the new home playground
        revalidatePath(`/teams/${result.data.slug}`);
    }

    return result;
}

export async function removeMember(teamId: string, memberId: string) {
    return fetchWithAuth(`/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
    });
}

export async function setCaptain(teamId: string, newCaptainId: string) {
    return fetchWithAuth(`/teams/${teamId}/captain`, {
        method: 'PATCH',
        body: JSON.stringify({ newCaptainId }),
    });
}

export async function getTeamCoachSummary(teamId: string): Promise<AnalyzeTeamPerformanceOutput | null> {
    const result = await fetchWithAuth<AnalyzeTeamPerformanceOutput>(`/teams/${teamId}/coach-summary`);
    if (!result.success) {
        console.error('Failed to fetch team coach summary:', result.error);
        return null;
    }
    return result.data as AnalyzeTeamPerformanceOutput;
}
