import type { PlayerStats } from "@/entities/user/model/types";

export const winLossData = { wins: 45, losses: 20 };
export const teamWinLossData = { wins: 58, losses: 12 };

export const mockPlayerStats: PlayerStats = {
    winLossData: { wins: 45, losses: 20 },
    kdaByMonthData: [
        { month: 'Янв', kda: 1.2 },
        { month: 'Фев', kda: 1.3 },
        { month: 'Мар', kda: 1.1 },
        { month: 'Апр', kda: 1.4 },
        { month: 'Май', kda: 1.5 },
        { month: 'Июн', kda: 1.25 },
    ],
    winrateByMapData: [
        { map: 'Ascent', winrate: 65 },
        { map: 'Bind', winrate: 72 },
        { map: 'Split', winrate: 58 },
        { map: 'Haven', winrate: 81 },
        { map: 'Icebox', winrate: 52 },
    ],
    summary: {
        matches: 65,
        winrate: 69.2,
        winStreak: 5,
        kda: 1.25,
    }
};
