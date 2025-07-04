import { getTeamLeaderboard } from '@/entities/team/api/get-leaderboard';
import { leaderboardData as playerLeaderboardData } from '@/shared/lib/mock-data/leaderboards';
import LeaderboardsClient from '@/app/(app)/leaderboards/client';

export async function LeaderboardsPage() {
    const teamLeaderboard = await getTeamLeaderboard();
    const playerLeaderboard = playerLeaderboardData; // Keep using mock data for this

    return (
        <LeaderboardsClient
            teamLeaderboard={teamLeaderboard}
            playerLeaderboard={playerLeaderboard}
        />
    );
}
