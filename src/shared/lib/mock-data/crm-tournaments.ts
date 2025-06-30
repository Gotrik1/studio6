export type TournamentCrm = {
    id: string;
    name: string;
    sport: string;
    status: 'Открыт набор' | 'Отбор' | 'В процессе' | 'Завершён' | 'Архив';
    participants: number;
    maxParticipants: number;
    startDate: string;
    organizer: string;
    rules: string;
};

export const crmTournaments: TournamentCrm[] = [
    {
        id: 'crm-tourney-1',
        name: 'Осенний Кубок ProDvor 2024',
        sport: 'Valorant',
        status: 'В процессе',
        participants: 16,
        maxParticipants: 16,
        startDate: '2024-09-01',
        organizer: 'ProDvor Events',
        rules: 'Стандартные правила Valorant. Single Elimination. Все матчи до одной победы (Bo1), финал до двух (Bo3).'
    },
    {
        id: 'crm-tourney-2',
        name: 'Чемпионат Москвы по футболу 5x5',
        sport: 'Футбол',
        status: 'Открыт набор',
        participants: 8,
        maxParticipants: 32,
        startDate: '2024-09-15',
        organizer: 'Superuser',
        rules: 'Правила дворового футбола 5x5. Два тайма по 15 минут. В случае ничьи - серия пенальти.'
    },
    {
        id: 'crm-tourney-3',
        name: 'Летний Старт 2024',
        sport: 'CS:GO 2',
        status: 'Завершён',
        participants: 16,
        maxParticipants: 16,
        startDate: '2024-07-01',
        organizer: 'ProDvor Events',
        rules: 'Классические соревновательные правила. Карты: de_dust2, de_mirage, de_inferno.'
    },
    {
        id: 'crm-tourney-4',
        name: 'Лига Новичков #3',
        sport: 'Dota 2',
        status: 'Архив',
        participants: 8,
        maxParticipants: 8,
        startDate: '2024-05-10',
        organizer: 'Superuser',
        rules: 'Режим Captains Mode. Только для игроков с рангом ниже "Легенды".'
    }
];
