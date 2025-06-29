export const disputedMatches = [
    {
        id: 'disp-001',
        team1: { name: 'Теневые Лисы', logo: 'https://placehold.co/100x100.png', logoHint: 'fox logo' },
        team2: { name: 'Стальные Титаны', logo: 'https://placehold.co/100x100.png', logoHint: 'titan logo' },
        score: '11-13',
        tournament: 'Лига ProDvor',
        reason: 'Команда "Теневые Лисы" обвиняет игрока "TheWall" в использовании бага карты для получения преимущества.',
        timestamp: '2024-07-29T12:00:00Z',
    },
    {
        id: 'disp-002',
        team1: { name: 'Команда X', logo: 'https://placehold.co/100x100.png', logoHint: 'letter x' },
        team2: { name: 'Команда Y', logo: 'https://placehold.co/100x100.png', logoHint: 'letter y' },
        score: '2-1',
        tournament: 'Weekly Cup #3',
        reason: 'Неявка команды Y на матч.',
        timestamp: '2024-07-30T18:00:00Z',
    }
];

export const resolvedMatches = [
     {
        id: 'res-001',
        team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/100x100.png', logoHint: 'eagle logo' },
        team2: { name: 'Команда B', logo: 'https://placehold.co/100x100.png', logoHint: 'letter b' },
        resolution: 'Победа присуждена Команде А из-за неявки соперника.',
        judge: 'Николай Васильев',
        timestamp: '2024-07-28T15:00:00Z',
    },
];

export type DisputedMatch = (typeof disputedMatches)[0];
export type ResolvedMatch = (typeof resolvedMatches)[0];
