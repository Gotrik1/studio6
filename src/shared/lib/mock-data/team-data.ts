type TeamSchedule = {
    id: number;
    opponent: string;
    date: string;
    tournament: string;
};

type MatchHistory = {
    id: number;
    opponent: string;
    result: 'Победа' | 'Поражение';
    score: string;
};

type TeamStats = {
    winRate: string;
    currentRank: string;
    totalMatches: number;
};

type TeamData = {
    schedule: TeamSchedule[];
    matchHistory: MatchHistory[];
    stats: TeamStats;
};

const teamDatabase: { [key: string]: TeamData } = {
    'cyber-eagles': {
        schedule: [
            { id: 1, opponent: 'Ледяные Волки', date: '2024-08-05 19:00', tournament: 'Лига ProDvor' },
            { id: 2, opponent: 'Теневые Лисы', date: '2024-08-12 21:00', tournament: 'Лига ProDvor' },
        ],
        matchHistory: [
            { id: 1, opponent: 'Стальные Титаны', result: 'Победа', score: '13-8' },
            { id: 2, opponent: 'Команда X', result: 'Поражение', score: '10-13' },
        ],
        stats: {
            winRate: '68%',
            currentRank: '#1',
            totalMatches: 45,
        }
    }
};


export function getTeamData(teamId: string) {
    return teamDatabase[teamId] || null;
}
