export const promotionsList = [
    {
        id: 'promo-1',
        title: 'Конкурс на лучший игровой момент',
        description: 'Запишите свой лучший момент в Valorant, опубликуйте его с хештегом #ProDvorHighlight и выиграйте!',
        prize: '10,000 PD + Игровая мышь Razer',
        sponsor: {
            name: 'Razer',
            logo: 'https://placehold.co/100x100.png',
            logoHint: 'gaming peripherals logo'
        },
        image: 'https://placehold.co/600x400.png',
        imageHint: 'gaming highlights montage',
        endDate: '2024-08-15'
    },
    {
        id: 'promo-2',
        title: 'G-Fuel Бонус за победу',
        description: 'Выиграйте матч в эти выходные и получите двойные PD от нашего партнера G-Fuel.',
        prize: 'x2 PD за победу',
        sponsor: {
            name: 'G-Fuel',
            logo: 'https://placehold.co/100x100.png',
            logoHint: 'energy drink logo'
        },
        image: 'https://placehold.co/600x400.png',
        imageHint: 'energy drink can',
        endDate: '2024-08-04'
    },
];

export type Promotion = (typeof promotionsList)[0];
