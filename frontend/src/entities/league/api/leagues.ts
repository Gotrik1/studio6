

'use client';

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
        teams: rawData.teams.map((lt: { team: { id: string, name: string, logo: string | null, dataAiHint: string | null }, played: number, wins: number, draws: number, losses: number, points: number }) => ({
            id: lt.team.id,
            name: lt.team.name,
            logo: lt.team.logo || 'https://placehold.co/100x100.png',
            logoHint: lt.team.dataAiHint || 'team logo',
            played: lt.played,
            wins: lt.wins,
            draws: lt.draws,
            losses: lt.losses,
            points: lt.points,
        })),
        matches: rawData.matches.map((m: { id: string, team1: { name: string, logo: string | null, dataAiHint: string | null }, team2: { name: string, logo: string | null, dataAiHint: string | null }, team1Score: number | null, team2Score: number | null, scheduledAt: string }) => ({
            id: m.id,
            team1: { name: m.team1.name, logo: m.team1.logo || 'https://placehold.co/100x100.png', logoHint: m.team1.dataAiHint || 'team logo' },
            team2: { name: m.team2.name, logo: m.team2.logo || 'https://placehold.co/100x100.png', logoHint: m.team2.dataAiHint || 'team logo' },
            score: `${m.team1Score}-${m.team2Score}`,
            date: m.scheduledAt,
        }))
    };
}
