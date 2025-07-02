'use client';

import { addDays, setHours, setMinutes } from 'date-fns';

const now = new Date();
const todayAt = (hour: number, minute: number = 0) => setMinutes(setHours(now, hour), minute);

export type LfgLobby = {
    id: string;
    sport: string;
    location: string;
    playgroundId?: string;
    startTime: Date;
    endTime: Date;
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
        location: 'Кольца на Школьном',
        playgroundId: 'playground-2',
        startTime: todayAt(19, 0),
        endTime: todayAt(20, 30),
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
        location: 'Коробка за Пятёрочкой',
        playgroundId: 'playground-1',
        startTime: setMinutes(setHours(addDays(now, 1), 20), 30),
        endTime: setMinutes(setHours(addDays(now, 1), 22), 0),
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
        startTime: setMinutes(setHours(addDays(now, 2), 12), 0),
        endTime: setMinutes(setHours(addDays(now, 2), 14), 0),
        playersNeeded: 6,
        playersJoined: 6,
        comment: 'Собираемся на пляжный волейбол. Все места заняты!',
        creator: {
            name: 'Viper',
            avatar: 'https://placehold.co/100x100.png',
        }
    }
];
