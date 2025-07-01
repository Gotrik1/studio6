
export const matchesList = [
    {
        id: '1',
        team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/100x100.png', logoHint: 'eagle logo' },
        team2: { name: 'Ледяные Волки', logo: 'https://placehold.co/100x100.png', logoHint: 'wolf logo' },
        score: '13-10',
        tournament: 'Летний Старт 2024',
        game: 'Valorant',
        date: '26 Июля 2024',
        status: 'Завершен',
        href: '/matches/123'
    },
    {
        id: '2',
        team1: { name: 'Теневые Лисы', logo: 'https://placehold.co/100x100.png', logoHint: 'fox logo' },
        team2: { name: 'Стальные Титаны', logo: 'https://placehold.co/100x100.png', logoHint: 'titan logo' },
        score: 'Live',
        tournament: 'Лига ProDvor',
        game: 'Valorant',
        date: '29 Июля 2024',
        status: 'Идет',
        href: '/matches/123'
    },
    {
        id: '3',
        team1: { name: 'Соколы', logo: 'https://placehold.co/100x100.png', logoHint: 'falcon logo' },
        team2: { name: 'Торпедо', logo: 'https://placehold.co/100x100.png', logoHint: 'torpedo logo' },
        score: 'VS',
        tournament: 'Moscow Open',
        game: 'Футбол',
        date: '1 Августа 2024',
        status: 'Предстоящий',
        href: '/matches/123'
    },
    {
        id: '4',
        team1: { name: 'Дворовые Атлеты', logo: 'https://placehold.co/100x100.png', logoHint: 'athletic team logo' },
        team2: { name: 'Вымпел', logo: 'https://placehold.co/100x100.png', logoHint: 'pennant logo' },
        score: 'VS',
        tournament: 'Кубок Города',
        game: 'Футбол',
        date: '3 Августа 2024',
        status: 'Предстоящий',
        href: '/matches/123'
    },
     {
        id: '5',
        team1: { name: 'Ледяные Волки', logo: 'https://placehold.co/100x100.png', logoHint: 'wolf logo' },
        team2: { name: 'Теневые Лисы', logo: 'https://placehold.co/100x100.png', logoHint: 'fox logo' },
        score: 'VS',
        tournament: 'Лига ProDvor',
        game: 'Valorant',
        date: '5 Августа 2024',
        status: 'Предстоящий',
        href: '/matches/123'
    },
];

export type Match = (typeof matchesList)[0];
