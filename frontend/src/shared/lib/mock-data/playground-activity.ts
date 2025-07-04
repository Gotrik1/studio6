
export type PlaygroundActivity = {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    comment: string;
    photo?: string;
    photoHint?: string;
    timestamp: string;
};

export const mockPlaygroundActivity: PlaygroundActivity[] = [
    {
        id: 'act-1',
        user: { name: 'Echo', avatar: 'https://placehold.co/100x100.png' },
        comment: 'Отличная игра сегодня! Покрытие в хорошем состоянии.',
        timestamp: '2 часа назад',
        photo: 'https://placehold.co/600x400.png',
        photoHint: 'basketball court action',
    },
    {
        id: 'act-2',
        user: { name: 'Viper', avatar: 'https://placehold.co/100x100.png' },
        comment: 'Много людей, но поиграть удалось. Освещение работает!',
        timestamp: '1 день назад',
    },
     {
        id: 'act-3',
        user: { name: 'Superuser', avatar: 'https://placehold.co/100x100.png' },
        comment: 'Провели интенсивную тренировку. Ворота немного скрипят, но в целом все отлично.',
        timestamp: '3 дня назад',
    },
];
