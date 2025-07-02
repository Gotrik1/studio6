import { matchesList } from '@/shared/lib/mock-data/matches';
import { teams } from '@/shared/lib/mock-data/teams';
import type { Team } from '@/entities/team/model/types';

type KingTeam = Team & { wins: number };

export function getKingOfTheCourt(playgroundId: string): KingTeam | null {
    const playgroundMatches = matchesList.filter(
        (match) => match.status === 'Завершен' && match.playgroundId === playgroundId
    );

    if (playgroundMatches.length === 0) {
        return null;
    }

    const winsCount = new Map<string, number>();

    playgroundMatches.forEach(match => {
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
    const teamInfo = teams.find(t => t.name === topTeamName);

    if (!teamInfo) {
        return null;
    }

    return {
        ...teamInfo,
        wins: topWins,
    };
}
