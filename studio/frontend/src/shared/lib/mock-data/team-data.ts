
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
    'dvotovyie-atlety': {
        schedule: [
            { id: 1, opponent: 'Соколы', date: '2024-08-05 19:00', tournament: 'Лига ProDvor' },
            { id: 2, opponent: 'Торпедо', date: '2024-08-12 21:00', tournament: 'Лига ProDvor' },
        ],
        matchHistory: [
            { id: 1, opponent: 'Вымпел', result: 'Победа', score: '5-2' },
            { id: 2, opponent: 'Команда X', result: 'Поражение', score: '3-4' },
        ],
        stats: {
            winRate: '72%',
            currentRank: '#1',
            totalMatches: 45,
        }
    }
};


export function getTeamData(teamId: string) {
    return teamDatabase[teamId] || null;
}
