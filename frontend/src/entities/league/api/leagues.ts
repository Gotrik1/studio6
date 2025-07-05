'use server';

import type { League, LeagueDetails } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getLeagues(): Promise<League[]> {
    const result = await fetchWithAuth('/leagues');
    if (!result.success) {
        console.error('Failed to fetch leagues:', result.error);
        return [];
    }
    return result.data;
}

export async function getLeagueById(id: string): Promise<LeagueDetails | null> {
    const result = await fetchWithAuth(`/leagues/${id}`);
    if (!result.success) {
        console.error(`Failed to fetch league ${id}:`, result.error);
        return null;
    }
    const rawData = result.data;

    // Transform backend data to frontend shape
    return {
        id: rawData.id,
        name: rawData.name,
        description: rawData.description,
        game: rawData.game,
        image: rawData.image,
        imageHint: rawData.imageHint,
        teams: rawData.teams.map((lt: any) => ({
            id: lt.team.id,
            name: lt.team.name,
            logo: lt.team.logo,
            logoHint: lt.team.dataAiHint,
            played: lt.played,
            wins: lt.wins,
            draws: lt.draws,
            losses: lt.losses,
            points: lt.points,
        })),
        matches: rawData.matches.map((m: any) => ({
            id: m.id,
            team1: m.team1,
            team2: m.team2,
            score: `${m.team1Score}-${m.team2Score}`,
            date: m.scheduledAt,
        }))
    };
}
