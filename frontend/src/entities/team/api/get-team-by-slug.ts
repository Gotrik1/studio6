

'use client';

import type { TeamDetails, TeamRosterMember } from '@/entities/team/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type { TeamDetails };

type BackendTeamMember = {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    status: string;
    adherence: number;
}

type BackendTeamData = Omit<TeamDetails, 'roster'> & {
    roster: BackendTeamMember[];
}


// Adapter function to map backend data to frontend TeamDetails type
const adaptBackendTeamToFrontend = (backendData: BackendTeamData): TeamDetails => {
  return {
    id: String(backendData.id),
    name: backendData.name,
    motto: backendData.motto,
    logo: backendData.logo || null,
    dataAiHint: backendData.dataAiHint,
    game: backendData.game,
    rank: backendData.rank,
    wins: backendData.wins,
    losses: backendData.losses,
    draws: backendData.draws,
    membersCount: backendData.membersCount,
    captainId: String(backendData.captainId),
    slug: backendData.slug,
    homePlaygroundId: backendData.homePlaygroundId,
    roster: (backendData.roster || []).map((member: BackendTeamMember): TeamRosterMember => ({
      id: String(member.id),
      name: member.name,
      avatar: member.avatar || null,
      role: member.role,
      status: member.status,
      adherence: member.adherence ?? 0,
    })),
  };
};


export async function getTeamBySlug(slug: string): Promise<TeamDetails | null> {
    const result = await fetchWithAuth(`/teams/slug/${slug}`, {
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

    return adaptBackendTeamToFrontend(rawTeamData as BackendTeamData);
}


