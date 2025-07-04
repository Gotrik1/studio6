
export type LeagueTeam = {
    id: string;
    name: string;
    logo: string;
    logoHint: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
};

export type LeagueMatch = {
    id: string;
    team1: { name: string; logo: string; logoHint: string; };
    team2: { name: string; logo: string; logoHint: string; };
    score: string;
    date: string;
};

export type League = {
    id: string;
    name: string;
    description: string;
    game: string;
    image: string;
    imageHint: string;
    teams: LeagueTeam[];
    matches: LeagueMatch[];
};

export const leagues: League[] = [
    {
        id: 'prodvor-football-league-1',
        name: 'ProDvor: Футбольная Лига - Сезон 1',
        description: 'Главная лига по дворовому футболу 5x5 на платформе. Лучшие команды соревнуются за звание чемпиона сезона.',
        game: 'Футбол',
        image: 'https://placehold.co/2560x720.png',
        imageHint: 'football league banner',
        teams: [
            { id: 'team-1', name: 'Дворовые Атлеты', logo: 'https://placehold.co/100x100.png', logoHint: 'athletic team logo', played: 3, wins: 3, draws: 0, losses: 0, points: 9 },
            { id: 'team-2', name: 'Соколы', logo: 'https://placehold.co/100x100.png', logoHint: 'falcon logo', played: 3, wins: 2, draws: 0, losses: 1, points: 6 },
            { id: 'team-3', name: 'Торпедо', logo: 'https://placehold.co/100x100.png', logoHint: 'torpedo logo', played: 3, wins: 1, draws: 0, losses: 2, points: 3 },
            { id: 'team-4', name: 'Вымпел', logo: 'https://placehold.co/100x100.png', logoHint: 'pennant logo', played: 3, wins: 0, draws: 0, losses: 3, points: 0 },
        ],
        matches: [
            { id: 'm-1', team1: { name: 'Дворовые Атлеты', logo: 'https://placehold.co/100x100.png', logoHint: 'athletic team logo' }, team2: { name: 'Вымпел', logo: 'https://placehold.co/100x100.png', logoHint: 'pennant logo' }, score: '5-2', date: '2024-08-03' },
            { id: 'm-2', team1: { name: 'Соколы', logo: 'https://placehold.co/100x100.png', logoHint: 'falcon logo' }, team2: { name: 'Торпедо', logo: 'https://placehold.co/100x100.png', logoHint: 'torpedo logo' }, score: '2-1', date: '2024-08-03' },
             { id: 'm-3', team1: { name: 'Дворовые Атлеты', logo: 'https://placehold.co/100x100.png', logoHint: 'athletic team logo' }, team2: { name: 'Соколы', logo: 'https://placehold.co/100x100.png', logoHint: 'falcon logo' }, score: '3-1', date: '2024-08-10' },
            { id: 'm-4', team1: { name: 'Торпедо', logo: 'https://placehold.co/100x100.png', logoHint: 'torpedo logo' }, team2: { name: 'Вымпел', logo: 'https://placehold.co/100x100.png', logoHint: 'pennant logo' }, score: '4-2', date: '2024-08-10' },
        ]
    }
];
