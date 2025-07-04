
export const coachesList = [
    {
        id: 'coach-1',
        name: 'Александр "Strateg" Тренеров',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'sports coach portrait',
        specialization: 'Valorant',
        description: 'Специализируюсь на макро-игре, стратегиях команды и ментальной подготовке. Помогу вашей команде достичь синергии и стабильности.',
        tags: ['стратегия', 'командная игра', 'Valorant'],
        rating: 4.9,
        price: '3000 PD/час',
        profileUrl: '/administration/coach',
    },
    {
        id: 'coach-2',
        name: 'Елена "Aim-God" Смирнова',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'female coach portrait',
        specialization: 'CS:GO 2',
        description: 'Поставлю вам идеальный аим. Работаю над микро-механикой, реакцией и точностью стрельбы. Индивидуальные тренировки.',
        tags: ['аим', 'стрельба', 'CS:GO 2'],
        rating: 4.8,
        price: '2500 PD/час',
        profileUrl: '/administration/coach',
    },
    {
        id: 'coach-3',
        name: 'Михаил "Tactician" Волков',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'sports coach serious',
        specialization: 'Футбол',
        description: 'Физическая и тактическая подготовка для футболистов. Работаю над выносливостью, позиционированием и техникой удара.',
        tags: ['физ. подготовка', 'тактика', 'футбол'],
        rating: 4.7,
        price: '2000 PD/час',
        profileUrl: '/administration/coach',
    },
];

export type Coach = (typeof coachesList)[0];
