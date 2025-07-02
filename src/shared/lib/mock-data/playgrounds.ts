export type Playground = {
    id: string;
    name: string;
    address: string;
    type: 'Футбол' | 'Баскетбол' | 'Стритбол' | 'Воркаут' | 'Универсальная';
    coverImage: string;
    coverImageHint: string;
    surface: 'Асфальт' | 'Резина' | 'Искусственный газон' | 'Грунт';
    features: string[];
    rating: number;
    checkIns: number;
    creator: {
        name: string;
        avatar: string;
    };
};

export const playgroundsList: Playground[] = [
    {
        id: 'playground-1',
        name: 'Коробка за Пятёрочкой',
        address: 'Москва, ул. Народного Ополчения, 22к2',
        type: 'Футбол',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'street football cage',
        surface: 'Искусственный газон',
        features: ['Ворота', 'Освещение'],
        rating: 4.5,
        checkIns: 128,
        creator: { name: 'Superuser', avatar: 'https://placehold.co/100x100.png' },
    },
    {
        id: 'playground-2',
        name: 'Кольца на Школьном',
        address: 'Москва, Школьная ул., 48',
        type: 'Стритбол',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'street basketball court',
        surface: 'Асфальт',
        features: ['Кольца', 'Разметка'],
        rating: 4.2,
        checkIns: 97,
        creator: { name: 'Echo', avatar: 'https://placehold.co/100x100.png' },
    },
    {
        id: 'playground-3',
        name: 'Турники в парке',
        address: 'Москва, Парк Фили',
        type: 'Воркаут',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'workout area park',
        surface: 'Резина',
        features: ['Турники', 'Брусья', 'Лесенка'],
        rating: 4.8,
        checkIns: 215,
        creator: { name: 'Viper', avatar: 'https://placehold.co/100x100.png' },
    },
];
