
'use server';

import type { TeamDetails, TeamRosterMember } from '@/entities/team/model/types';

export type { TeamDetails };

// Adapter function to map backend data to frontend TeamDetails type
const adaptBackendTeamToFrontend = (backendData: any): TeamDetails => {
  return {
    id: String(backendData.id),
    name: backendData.name,
    motto: backendData.motto,
    logo: backendData.logo || backendData.logoUrl || null, // Handle both possible field names
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
    roster: (backendData.roster || []).map((member: any): TeamRosterMember => ({
      id: String(member.id),
      name: member.name || member.fullName, // Handle both possible field names
      avatar: member.avatar || member.avatarUrl || null,
      role: member.role,
      rating: member.rating,
      status: member.status,
    })),
  };
};


export async function getTeamBySlug(slug: string): Promise<TeamDetails | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!baseUrl) {
            console.error('Backend URL not configured');
            return null;
        }
        const res = await fetch(`${baseUrl}/teams/slug/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null; // Handle 404 or other errors gracefully
        }
        
        const rawTeamData = await res.json();
        if (!rawTeamData) {
            return null;
        }

        return adaptBackendTeamToFrontend(rawTeamData);

    } catch (error) {
        console.error(`Failed to fetch team by slug ${slug}:`, error);
        return null;
    }
}
