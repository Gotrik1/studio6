"use client";

import type { League, LeagueDetails } from "../model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Prisma } from "@prisma/client";

type Team = Prisma.TeamGetPayload<{
  select: {
    id: true;
    name: true;
    logo: true;
    dataAiHint: true;
    slug: true;
    rank: true;
    game: true;
  };
}>;

type Match = Prisma.MatchGetPayload<{
  include: {
    team1: true;
    team2: true;
  };
}>;

type BackendLeagueTeam = {
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};
type BackendMatch = Match;

type RawBackendLeagueDetails = Omit<League, "teams" | "matches"> & {
  teams: BackendLeagueTeam[];
  matches: BackendMatch[];
};

export async function getLeagues(): Promise<League[]> {
  const result = await fetchWithAuth<League[]>("/leagues");
  if (!result.success || !result.data) {
    console.error("Failed to fetch leagues:", result.error);
    return [];
  }
  return result.data;
}

export async function getLeagueById(id: string): Promise<LeagueDetails | null> {
  const result = await fetchWithAuth<RawBackendLeagueDetails>(`/leagues/${id}`);
  if (!result.success || !result.data) {
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
    teams: rawData.teams.map((lt: BackendLeagueTeam) => ({
      id: lt.team.id,
      name: lt.team.name,
      logo: lt.team.logo || "https://placehold.co/100x100.png",
      logoHint: lt.team.dataAiHint || "team logo",
      played: lt.played,
      wins: lt.wins,
      draws: lt.draws,
      losses: lt.losses,
      points: lt.points,
      slug: lt.team.slug, // Include slug
      game: lt.team.game, // Include game
      rank: lt.team.rank, // Include rank
    })),
    matches: rawData.matches.map((m: BackendMatch) => ({
      id: m.id,
      team1: {
        name: m.team1.name,
        logo: m.team1.logo || "https://placehold.co/100x100.png",
        logoHint: m.team1.dataAiHint || "team logo",
      },
      team2: {
        name: m.team2.name,
        logo: m.team2.logo || "https://placehold.co/100x100.png",
        logoHint: m.team2.dataAiHint || "team logo",
      },
      score: `${m.team1Score}-${m.team2Score}`,
      date: new Date(m.scheduledAt).toISOString(),
    })),
  };
}
