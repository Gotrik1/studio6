
export type Playground = {
    id: string;
    name: string;
    address: string;
    type: 'Футбол' | 'Баскетбол' | 'Стритбол' | 'Воркаут' | 'Универсальная' | 'Фитнес-зал' | 'Бассейн' | 'Теннисный корт' | 'Лыжная трасса' | 'Биатлонный комплекс' | 'Каток' | 'Сноуборд-парк' | 'Горнолыжный склон' | 'Стрельбище';
    coverImage: string;
    coverImageHint: string;
    surface: 'Асфальт' | 'Резина' | 'Искусственный газон' | 'Грунт' | 'Паркет' | 'Профессиональный газон' | 'Вода' | 'Снег' | 'Лед';
    features: string[];
    rating: number;
    checkIns: number;
    status: 'approved' | 'pending_moderation';
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
        coverImage: 'https://placehold.co/2560x720.png',
        coverImageHint: 'street football cage',
        surface: 'Искусственный газон',
        features: ['Ворота', 'Освещение'],
        rating: 4.5,
        checkIns: 128,
        status: 'approved',
        creator: { name: 'Superuser', avatar: 'https://placehold.co/100x100.png' },
    },
    {
        id: 'playground-2',
        name: 'Кольца на Школьном',
        address: 'Москва, Школьная ул., 48',
        type: 'Стритбол',
        coverImage: 'https://placehold.co/2560x720.png',
        coverImageHint: 'street basketball court',
        surface: 'Асфальт',
        features: ['Кольца', 'Разметка'],
        rating: 4.2,
        checkIns: 97,
        status: 'approved',
        creator: { name: 'Echo', avatar: 'https://placehold.co/100x100.png' },
    },
    {
        id: 'playground-3',
        name: 'Турники в парке',
        address: 'Москва, Парк Фили',
        type: 'Воркаут',
        coverImage: 'https://placehold.co/2560x720.png',
        coverImageHint: 'workout area park',
        surface: 'Резина',
        features: ['Турники', 'Брусья', 'Лесенка'],
        rating: 4.8,
        checkIns: 215,
        status: 'approved',
        creator: { name: 'Viper', avatar: 'https://placehold.co/100x100.png' },
    },
    {
        id: 'playground-4',
        name: 'Поле у реки',
        address: 'Санкт-Петербург, наб. реки Карповки, 5',
        type: 'Универсальная',
        coverImage: 'https://placehold.co/2560x720.png',
        coverImageHint: 'sports field river',
        surface: 'Грунт',
        features: ['Ворота', 'Баскетбольные кольца'],
        rating: 3.8,
        checkIns: 54,
        status: 'pending_moderation',
        creator: { name: 'Foxy', avatar: 'https://placehold.co/100x100.png' },
    },
    {
        id: 'playground-5',
        name: 'Фитнес-клуб "Атлет"',
        address: 'Москва, Ленинский проспект, 72',
        type: 'Фитнес-зал',
        coverImage: 'https://placehold.co/2560x720.png',
        coverImageHint: 'fitness gym interior',
        surface: 'Резина',
        features: ['Силовые тренажеры', 'Кардио-зона', 'Раздевалка с душем'],
        rating: 4.9,
        checkIns: 531,
        status: 'approved',
        creator: { name: 'ProDvor', avatar: 'https://placehold.co/100x100.png' },
    },
];
