export const sponsoredTeams = [
    {
        slug: 'dvotovyie-atlety',
        name: 'Дворовые Атлеты',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'athletic team logo',
        investment: '50,000 PD',
        since: '2024-01-15'
    },
    {
        slug: 'sokoly',
        name: 'Соколы',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'falcon logo',
        investment: 'Игровая экипировка',
        since: '2024-03-01'
    }
];

export const teamsSeekingSponsorship = [
    {
        slug: 'torpedo',
        name: 'Торпедо',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'torpedo logo',
        game: 'Хоккей',
        pitch: 'Мы - быстрорастущая команда с активной фан-базой. Ищем партнера для оплаты льда и выездных игр.'
    },
    {
        slug: 'vympel',
        name: 'Вымпел',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'pennant logo',
        game: 'Волейбол',
        pitch: 'Нашей команде нужна новая форма и инвентарь для выхода на новый уровень.'
    }
];

export type SponsorshipOffer = {
    id: string;
    sponsor: {
        name: string;
        logo: string;
        logoHint: string;
    };
    offer: string;
    status: 'pending' | 'accepted' | 'declined';
};

export const incomingSponsorshipOffers: SponsorshipOffer[] = [
    {
        id: 'offer-1',
        sponsor: { name: 'Nike', logo: 'https://placehold.co/100x100.png', logoHint: 'nike logo' },
        offer: 'Полный комплект игровой формы на сезон 2024.',
        status: 'pending'
    },
     {
        id: 'offer-2',
        sponsor: { name: 'Local Gym', logo: 'https://placehold.co/100x100.png', logoHint: 'gym logo' },
        offer: 'Бесплатный годовой абонемент в зал для всей команды.',
        status: 'pending'
    }
];
