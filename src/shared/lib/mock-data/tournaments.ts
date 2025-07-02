

export const allTournaments = [
    {
        name: 'Летний Кубок по Стритболу',
        game: 'Баскетбол',
        prize: '10,000 PD',
        status: 'Завершен',
        date: '1-7 Июля 2024',
        image: 'https://placehold.co/2560x720.png',
        dataAiHint: 'streetball court action',
        slug: 'summer-streetball-cup-2024',
    },
    {
        name: 'Кубок ProDvor по Футболу',
        game: 'Футбол',
        prize: '50,000₽',
        status: 'Идет',
        date: '16-19 Августа 2024',
        image: 'https://placehold.co/2560x720.png',
        dataAiHint: 'football stadium action',
        slug: 'prodvor-football-cup-2024',
    },
    {
        name: 'Moscow Open Chess Championship',
        game: 'Шахматы',
        prize: '500,000₽',
        status: 'Регистрация',
        date: '1-15 Августа 2024',
        image: 'https://placehold.co/2560x720.png',
        dataAiHint: 'chess tournament',
        slug: 'moscow-chess-open-2024',
    },
    {
        name: 'ProDvor Hockey League',
        game: 'Хоккей',
        prize: '$5,000',
        status: 'Идет',
        date: 'Каждую субботу',
        image: 'https://placehold.co/2560x720.png',
        dataAiHint: 'ice hockey game',
        slug: 'prodvor-hockey-league',
    },
    {
        name: 'Backyard Volleyball Battle',
        game: 'Волейбол',
        prize: 'Спортивный инвентарь',
        status: 'Завершен',
        date: '15-16 Июня 2024',
        image: 'https://placehold.co/2560x720.png',
        dataAiHint: 'volleyball action',
        slug: 'volleyball-backyard-battle',
    },
];

export type Tournament = (typeof allTournaments)[0];
