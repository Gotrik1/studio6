
export const coachedPlayers = [
    {
        id: 'p1',
        name: "Алексей 'Sonic' Петров",
        role: 'Дуэлянт',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player',
        stats: { kda: '1.4', winRate: '62%', favoriteMap: 'Ascent' },
        matchHistory: 'vs Team A: W 13-5\nvs Team B: W 13-10\nvs Team C: L 8-13',
    },
    {
        id: 'p2',
        name: "Марина 'Vixen' Волкова",
        role: 'Страж',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player female',
        stats: { kda: '1.1', winRate: '59%', favoriteMap: 'Bind' },
        matchHistory: 'vs Team A: W 13-5\nvs Team D: L 12-14\nvs Team E: W 13-9',
    },
];

export type CoachedPlayer = (typeof coachedPlayers)[0];
