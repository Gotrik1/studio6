
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
    }
];
