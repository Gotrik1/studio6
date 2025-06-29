export type TournamentCrm = {
    id: string;
    name: string;
    sport: string;
    status: 'Открыт набор' | 'Отбор' | 'В процессе' | 'Завершён' | 'Архив';
    participants: number;
    maxParticipants: number;
    startDate: string;
    organizer: string;
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
        organizer: 'ProDvor Events'
    },
    {
        id: 'crm-tourney-2',
        name: 'Чемпионат Москвы по футболу 5x5',
        sport: 'Футбол',
        status: 'Открыт набор',
        participants: 8,
        maxParticipants: 32,
        startDate: '2024-09-15',
        organizer: 'Superuser'
    },
    {
        id: 'crm-tourney-3',
        name: 'Летний Старт 2024',
        sport: 'CS:GO 2',
        status: 'Завершён',
        participants: 16,
        maxParticipants: 16,
        startDate: '2024-07-01',
        organizer: 'ProDvor Events'
    },
    {
        id: 'crm-tourney-4',
        name: 'Лига Новичков #3',
        sport: 'Dota 2',
        status: 'Архив',
        participants: 8,
        maxParticipants: 8,
        startDate: '2024-05-10',
        organizer: 'Superuser'
    }
];
