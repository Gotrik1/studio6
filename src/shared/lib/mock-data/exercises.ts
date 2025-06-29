export type Exercise = {
    id: string;
    name: string;
    description: string;
    muscleGroup: 'Грудь' | 'Спина' | 'Ноги' | 'Плечи' | 'Руки' | 'Пресс';
    equipment: 'Штанга' | 'Гантели' | 'Тренажер' | 'Собственный вес';
    image: string;
    imageHint: string;
};

export const exercisesList: Exercise[] = [
    {
        id: 'ex-1',
        name: 'Жим лежа',
        description: 'Базовое упражнение для развития мышц груди, а также трицепсов и передних дельт.',
        muscleGroup: 'Грудь',
        equipment: 'Штанга',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'bench press'
    },
    {
        id: 'ex-2',
        name: 'Приседания со штангой',
        description: 'Фундаментальное упражнение для развития мышц ног и ягодиц.',
        muscleGroup: 'Ноги',
        equipment: 'Штанга',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'barbell squat'
    },
    {
        id: 'ex-3',
        name: 'Становая тяга',
        description: 'Комплексное упражнение, задействующее практически все мышечные группы.',
        muscleGroup: 'Спина',
        equipment: 'Штанга',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'deadlift'
    },
    {
        id: 'ex-4',
        name: 'Подтягивания',
        description: 'Лучшее упражнение для развития широчайших мышц спины с собственным весом.',
        muscleGroup: 'Спина',
        equipment: 'Собственный вес',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'pull ups'
    },
    {
        id: 'ex-5',
        name: 'Жим гантелей сидя',
        description: 'Отличное упражнение для развития дельтовидных мышц.',
        muscleGroup: 'Плечи',
        equipment: 'Гантели',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'dumbbell press'
    },
    {
        id: 'ex-6',
        name: 'Скручивания на полу',
        description: 'Классическое упражнение для тренировки мышц пресса.',
        muscleGroup: 'Пресс',
        equipment: 'Собственный вес',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'crunches'
    },
    {
        id: 'ex-7',
        name: 'Разведение гантелей лежа',
        description: 'Изолирующее упражнение для растяжения и проработки грудных мышц.',
        muscleGroup: 'Грудь',
        equipment: 'Гантели',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'dumbbell flys'
    },
    {
        id: 'ex-8',
        name: 'Сгибание ног в тренажере',
        description: 'Изолирующее упражнение для задней поверхности бедра.',
        muscleGroup: 'Ноги',
        equipment: 'Тренажер',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'leg curls'
    },
];
