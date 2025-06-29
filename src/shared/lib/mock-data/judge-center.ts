
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
];

export const resolvedMatches = [
     {
        id: 'res-001',
        team1: { name: 'Команда A', logo: 'https://placehold.co/100x100.png' },
        team2: { name: 'Команда B', logo: 'https://placehold.co/100x100.png' },
        resolution: 'Победа присуждена Команде А из-за неявки соперника.',
        judge: 'Николай Васильев',
        timestamp: '2024-07-28T15:00:00Z',
    },
];

export type DisputedMatch = (typeof disputedMatches)[0];
