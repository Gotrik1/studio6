
export const reportsQueue = [
    {
        id: 'rep-001',
        reportedUser: { name: "ToxicPlayer123", avatar: 'https://placehold.co/40x40.png', avatarHint: 'player avatar' },
        reportedBy: { name: "FairPlayer" },
        reason: 'Оскорбления в чате',
        context: "ToxicPlayer123: Ты просто нуб, удали игру.\nFairPlayer: Пожалуйста, будь вежливее.\nToxicPlayer123: Заткнись и играй, мусор.",
        timestamp: '2024-07-29T10:00:00Z',
    },
    {
        id: 'rep-002',
        reportedUser: { name: "CheaterSuspect", avatar: 'https://placehold.co/40x40.png', avatarHint: 'player avatar' },
        reportedBy: { name: "Observer" },
        reason: 'Использование читов (Wallhack)',
        context: "Пользователь постоянно предугадывал наши позиции, стреляя через дым без какой-либо информации. Ссылка на демо: [link]",
        timestamp: '2024-07-29T11:30:00Z',
    },
    {
        id: 'rep-003',
        reportedUser: { name: "SpammerBot", avatar: 'https://placehold.co/40x40.png', avatarHint: 'bot avatar' },
        reportedBy: { name: "Superuser" },
        reason: 'Спам/Реклама',
        context: "SpammerBot: Покупайте скины на [website].com! Лучшие цены!",
        timestamp: '2024-07-29T12:00:00Z',
    },
];

export type Report = (typeof reportsQueue)[0];
