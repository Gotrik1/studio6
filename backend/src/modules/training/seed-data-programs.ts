export type ExerciseDetail = {
    name: string;
    sets: string;
    reps: string;
    plannedWeight?: string;
    isSupersetWithPrevious?: boolean;
    technique?: string;
};

export type WorkoutDay = {
    day: number;
    title: string;
    exercises: ExerciseDetail[];
};

export type TrainingProgram = {
    id: string;
    name: string;
    description: string;
    goal: 'Набор массы' | 'Снижение веса' | 'Рельеф' | 'Сила';
    daysPerWeek: number;
    splitType: 'Full-body' | 'Split' | 'Upper/Lower';
    author: string;
    coverImage: string;
    coverImageHint: string;
    isAiGenerated?: boolean;
    weeklySplit: WorkoutDay[];
};

export const trainingPrograms: TrainingProgram[] = [
    {
        id: 'classic-split-3',
        name: 'Классический 3-дневный сплит',
        description: 'Проверенная временем программа для набора мышечной массы и проработки всех основных мышечных групп.',
        goal: 'Набор массы',
        daysPerWeek: 3,
        splitType: 'Split',
        author: 'ProDvor Team',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'gym weights',
        weeklySplit: [
            { day: 1, title: 'Грудь и Трицепс', exercises: [
                { name: 'Жим лежа', sets: '4', reps: '8-10' },
                { name: 'Разведение гантелей лежа', sets: '3', reps: '12-15' },
            ]},
            { day: 2, title: 'Спина и Бицепс', exercises: [
                 { name: 'Подтягивания', sets: '4', reps: 'max' },
                 { name: 'Становая тяга', sets: '3', reps: '6-8' },
                 { name: 'Тяга штанги в наклоне', sets: '4', reps: '8-10' },
            ]},
            { day: 3, title: 'Ноги и Плечи', exercises: [
                 { name: 'Приседания со штангой', sets: '4', reps: '8-10' },
                 { name: 'Жим ногами', sets: '3', reps: '10-12' },
                 { name: 'Жим гантелей сидя', sets: '4', reps: '8-10' },
            ]},
        ]
    },
    {
        id: 'female-glute',
        name: 'Женский сплит на ягодицы',
        description: 'Специализированная программа с акцентом на развитие ягодичных мышц и ног для создания гармоничной фигуры.',
        goal: 'Рельеф',
        daysPerWeek: 4,
        splitType: 'Split',
        author: 'Coach Anna',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'woman fitness',
        weeklySplit: [],
    },
    {
        id: 'power-split',
        name: 'Пауэр-сплит',
        description: 'Программа, нацеленная на максимальное увеличение силовых показателей в базовых движениях.',
        goal: 'Сила',
        daysPerWeek: 4,
        splitType: 'Upper/Lower',
        author: 'Strongman Pete',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'barbell deadlift',
        weeklySplit: [],
    },
    {
        id: 'fullbody-beginner',
        name: 'Full-body для новичков',
        description: 'Идеальная программа для начинающих, чтобы укрепить всё тело и подготовиться к более серьезным нагрузкам.',
        goal: 'Набор массы',
        daysPerWeek: 3,
        splitType: 'Full-body',
        author: 'ProDvor Team',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'man training gym',
        weeklySplit: [],
    },
    {
        id: 'ai-split-busy',
        name: 'AI-сплит для занятых',
        description: 'Индивидуальный план, сгенерированный AI, который адаптируется под ваш график и цели.',
        goal: 'Снижение веса',
        daysPerWeek: 2,
        splitType: 'Full-body',
        author: 'ProDvor AI',
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'ai circuit board',
        isAiGenerated: true,
        weeklySplit: [],
    },
    {
        id: 'fat-loss-hiit',
        name: 'HIIT для сжигания жира',
        description: 'Высокоинтенсивная интервальная тренировка для максимального расхода калорий и ускорения метаболизма.',
        goal: 'Снижение веса',
        daysPerWeek: 3,
        splitType: 'Full-body',
        author: 'Coach Elena', // New author
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'woman running fast',
        weeklySplit: [],
    },
    {
        id: 'bodyweight-strength',
        name: 'Сила без железа',
        description: 'Программа для развития силы и выносливости с использованием только собственного веса. Идеально для дома или улицы.',
        goal: 'Сила',
        daysPerWeek: 4,
        splitType: 'Full-body',
        author: 'StreetWorkout Pro', // New author
        coverImage: 'https://placehold.co/600x400.png',
        coverImageHint: 'calisthenics workout',
        weeklySplit: [],
    }
];
