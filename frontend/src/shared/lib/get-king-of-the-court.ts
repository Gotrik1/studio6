import { fetchMatches } from '@/entities/match/api/get-matches';
import { getTeams } from '@/entities/team/api/get-teams';
import type { Team } from '@/entities/team/model/types';
import type { Match } from '@/entities/match/model/types';

type KingTeam = Team & { wins: number };

export async function getKingOfTheCourt(playgroundId: string): Promise<KingTeam | null> {
    const [matchesList, teams] = await Promise.all([
        fetchMatches(),
        getTeams()
    ]);

    const playgroundMatches = matchesList.filter(
        (match: Match) => match.status === 'Завершен' && match.playgroundId === playgroundId
    );

    if (playgroundMatches.length === 0) {
        return null;
    }

    const winsCount = new Map<string, number>();

    playgroundMatches.forEach((match: Match) => {
        const scoreParts = match.score.split('-').map(s => parseInt(s.trim()));
        if (scoreParts.length < 2 || isNaN(scoreParts[0]) || isNaN(scoreParts[1])) {
            return;
        }

        let winnerName: string | null = null;
        if (scoreParts[0] > scoreParts[1]) {
            winnerName = match.team1.name;
        } else if (scoreParts[1] > scoreParts[0]) {
            winnerName = match.team2.name;
        }

        if (winnerName) {
            winsCount.set(winnerName, (winsCount.get(winnerName) || 0) + 1);
        }
    });

    if (winsCount.size === 0) {
        return null;
    }

    const [topTeamName, topWins] = [...winsCount.entries()].reduce((a, b) => b[1] > a[1] ? b : a);
    const teamInfo = teams.find((t: Team) => t.name === topTeamName);

    if (!teamInfo) {
        return null;
    }

    return {
        ...teamInfo,
        wins: topWins,
    };
}
