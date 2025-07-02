
'use server';

export type PlaygroundReview = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    rating: number; // 1 to 5
    comment: string;
    timestamp: string;
};

export const mockPlaygroundReviews: PlaygroundReview[] = [
    {
        id: 'rev-1',
        author: { name: 'Echo', avatar: 'https://placehold.co/100x100.png' },
        rating: 5,
        comment: 'Отличное новое покрытие! Играть одно удовольствие. Освещение тоже на высоте, можно бегать до поздна.',
        timestamp: '2 дня назад',
    },
    {
        id: 'rev-2',
        author: { name: 'Viper', avatar: 'https://placehold.co/100x100.png' },
        rating: 4,
        comment: 'Хорошая площадка, но кольца немного низковаты, как мне показалось. В целом все супер.',
        timestamp: '5 дней назад',
    },
    {
        id: 'rev-3',
        author: { name: 'Reaper', avatar: 'https://placehold.co/100x100.png' },
        rating: 3,
        comment: 'В часы пик очень много народу, сложно найти свободное место. Пришлось ждать почти час.',
        timestamp: '1 неделю назад',
    },
];
