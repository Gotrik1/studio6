"use server";

import type {
  TournamentDetails,
  BracketMatch,
  BracketRound,
  MatchEvent,
  TournamentMedia as FrontendTournamentMedia,
} from "@/entities/tournament/model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";

// Local types to avoid direct dependency on backend schemas
type RawTeam = {
  name: string;
  logo: string | null;
  dataAiHint: string | null;
  slug?: string;
};
type RawMatch = {
  id: string | number;
  team1Score: number | null;
  team2Score: number | null;
  scheduledAt: string;
  winner?: boolean;
  href?: string;
  date?: string;
  time?: string;
  team1?: RawTeam;
  team2?: RawTeam;
  events?: MatchEvent[];
};
type RawRound = { name: string; matches: RawMatch[] };
type RawUser = { name: string; avatar: string | null };
type RawTournamentMedia = {
  id: string;
  createdAt: string;
  tournamentId: string;
  description: string | null;
  type: string;
  src: string;
  hint: string | null;
};

type RawTournamentData = Omit<
  TournamentDetails,
  "bracket" | "teams" | "matches" | "media" | "organizer"
> & {
  bracket: { rounds: RawRound[] };
  teams: RawTeam[];
  matches: RawMatch[];
  media: RawTournamentMedia[];
  organizer: RawUser;
};

// Adapter function to transform raw backend data into the frontend's TournamentDetails type
function adaptTournamentDetails(data: RawTournamentData): TournamentDetails {
  if (!data) return null as unknown as TournamentDetails;

  const shapeTeam = (team: RawTeam | null | undefined) => ({
    name: team?.name || "TBD",
    logo: team?.logo || null,
    dataAiHint: team?.dataAiHint || "team logo",
    slug: team?.slug,
  });

  const shapeMatch = (match: RawMatch): BracketMatch => ({
    id: String(match.id),
    team1: match.team1 ? shapeTeam(match.team1) : undefined,
    team2: match.team2 ? shapeTeam(match.team2) : undefined,
    score:
      match.team1Score !== null && match.team2Score !== null
        ? `${match.team1Score}-${match.team2Score}`
        : "VS",
    winner: match.winner,
    href: `/matches/${String(match.id)}`,
    date: match.scheduledAt
      ? new Date(match.scheduledAt).toISOString()
      : undefined,
    time: match.scheduledAt
      ? new Date(match.scheduledAt).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    events: match.events,
  });

  // Adapt the main tournament object
  return {
    ...data,
    id: String(data.id),
    teams: (data.teams || []).map(shapeTeam),
    matches: (data.matches || []).map(shapeMatch),
    bracket: {
      ...data.bracket,
      rounds: (data.bracket?.rounds || []).map(
        (round: RawRound): BracketRound => ({
          ...round,
          matches: (round.matches || []).map(shapeMatch),
        }),
      ),
    },
    organizer: {
      name: data.organizer?.name || "Unknown",
      avatar: data.organizer?.avatar || null,
    },
    media: (data.media || []).map((m) => ({
      ...m,
      createdAt: new Date(m.createdAt).toISOString(),
    })),
  };
}

export async function getTournamentBySlug(
  slug: string,
): Promise<TournamentDetails | null> {
  const result = await fetchWithAuth<RawTournamentData>(
    `/tournaments/slug/${slug}`,
  );

  if (!result.success || !result.data) {
    console.error(`Failed to fetch tournament ${slug}:`, result.error);
    return null;
  }

  return adaptTournamentDetails(result.data);
}

export async function getTournamentById(
  id: string,
): Promise<TournamentDetails | null> {
  const result = await fetchWithAuth<RawTournamentData>(`/tournaments/${id}`);

  if (!result.success || !result.data) {
    console.error(`Failed to fetch tournament ${id}:`, result.error);
    return null;
  }

  return adaptTournamentDetails(result.data);
}
