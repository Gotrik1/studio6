import { addDays, setHours, setMinutes } from 'date-fns';

const now = new Date();

export type TeamPractice = {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    playgroundId: string;
};

export const teamPractices: TeamPractice[] = [
    {
        id: 'tp-1',
        title: 'Отработка угловых ударов',
        description: 'Сосредоточимся на стандартных положениях. Разберем атакующие и оборонительные схемы.',
        date: setMinutes(setHours(addDays(now, 2), 19), 0),
        location: 'Коробка за Пятёрочкой',
        playgroundId: 'playground-1',
    },
    {
        id: 'tp-2',
        title: 'Тактическая тренировка: высокий прессинг',
        description: 'Отрабатываем командное взаимодействие при высоком прессинге и быстрый переход из обороны в атаку.',
        date: setMinutes(setHours(addDays(now, 5), 20), 0),
        location: 'Коробка за Пятёрочкой',
        playgroundId: 'playground-1',
    },
];
