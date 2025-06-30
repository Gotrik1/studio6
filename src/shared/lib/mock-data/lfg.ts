
export type LfgLobby = {
    id: string;
    sport: string;
    location: string;
    time: string;
    playersNeeded: number;
    playersJoined: number;
    comment: string;
    creator: {
        name: string;
        avatar: string;
    };
};

export const initialLfgLobbies: LfgLobby[] = [
    {
        id: 'lfg-1',
        sport: 'Баскетбол 3x3',
        location: 'Парк Горького, площадка #2',
        time: 'Сегодня в 19:00',
        playersNeeded: 4,
        playersJoined: 2,
        comment: 'Ищем двух игроков для легкой игры после работы. Уровень средний.',
        creator: {
            name: 'Echo',
            avatar: 'https://placehold.co/100x100.png',
        }
    },
    {
        id: 'lfg-2',
        sport: 'Футбол 5x5',
        location: 'Стадион "Лужники", поле D',
        time: 'Завтра в 20:30',
        playersNeeded: 10,
        playersJoined: 8,
        comment: 'Нужно еще двое на товарищеский матч. Играем на арендованном поле.',
        creator: {
            name: 'Superuser',
            avatar: 'https://placehold.co/100x100.png',
        }
    },
    {
        id: 'lfg-3',
        sport: 'Волейбол',
        location: 'Пляж "Серебряный Бор"',
        time: 'Суббота, 12:00',
        playersNeeded: 6,
        playersJoined: 6,
        comment: 'Собираемся на пляжный волейбол. Все места заняты!',
        creator: {
            name: 'Viper',
            avatar: 'https://placehold.co/100x100.png',
        }
    }
];
