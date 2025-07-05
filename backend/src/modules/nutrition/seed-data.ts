export type FoodItem = {
    id: string;
    name: string;
    category: 'Продукты' | 'Спортивное питание';
    image: string;
    imageHint: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    description?: string;
};

export const nutritionItems: FoodItem[] = [
    {
        id: 'food-1',
        name: 'Куриная грудка',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'chicken breast',
        calories: 165,
        protein: 31,
        fat: 3.6,
        carbs: 0,
        description: 'Отличный источник белка. Указано на 100г в сыром виде.'
    },
    {
        id: 'food-2',
        name: 'Гречка',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'buckwheat',
        calories: 343,
        protein: 13,
        fat: 3.4,
        carbs: 72,
        description: 'Сложные углеводы для долгой энергии. Указано на 100г сухой крупы.'
    },
    {
        id: 'food-3',
        name: 'Яйцо куриное',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'chicken egg',
        calories: 155,
        protein: 13,
        fat: 11,
        carbs: 1.1,
        description: 'Источник белка и полезных жиров. Указано на 100г.'
    },
    {
        id: 'food-4',
        name: 'Творог 5%',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'cottage cheese',
        calories: 121,
        protein: 17,
        fat: 5,
        carbs: 1.8,
        description: 'Медленный белок (казеин), идеален на ночь. Указано на 100г.'
    },
    {
        id: 'food-5',
        name: 'Оливковое масло',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'olive oil',
        calories: 884,
        protein: 0,
        fat: 100,
        carbs: 0,
        description: 'Полезные ненасыщенные жиры. Указано на 100г.'
    },
    {
        id: 'food-6',
        name: 'Банан',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'banana',
        calories: 89,
        protein: 1.1,
        fat: 0.3,
        carbs: 23,
        description: 'Быстрые углеводы для энергии перед тренировкой. Указано на 100г.'
    },
    {
        id: 'food-7',
        name: 'Протеин сывороточный',
        category: 'Спортивное питание',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'whey protein',
        calories: 400,
        protein: 80,
        fat: 5,
        carbs: 8,
        description: 'Быстрый белок для восстановления после тренировки. Указано на 100г порошка.'
    },
    {
        id: 'food-8',
        name: 'Креатин моногидрат',
        category: 'Спортивное питание',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'creatine powder',
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        description: 'Для увеличения силовых показателей. Не имеет калорийности.'
    }
];
