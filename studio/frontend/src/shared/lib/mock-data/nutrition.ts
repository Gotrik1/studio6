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
        description: 'Отличный источник чистого белка. Калории на 100г.'
    },
    {
        id: 'food-2',
        name: 'Гречка',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'buckwheat',
        calories: 132,
        protein: 4.5,
        fat: 0.9,
        carbs: 29,
        description: 'Сложные углеводы для долгой энергии. Калории на 100г вареного продукта.'
    },
    {
        id: 'food-3',
        name: 'Творог 5%',
        category: 'Продукты',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'cottage cheese',
        calories: 121,
        protein: 17,
        fat: 5,
        carbs: 1.8,
        description: 'Медленный белок (казеин), идеален перед сном. Калории на 100г.'
    },
    {
        id: 'sup-1',
        name: 'Протеин Whey Gold Standard',
        category: 'Спортивное питание',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'protein powder',
        calories: 120,
        protein: 24,
        fat: 1,
        carbs: 3,
        description: 'Быстрый белок для восстановления после тренировки. Калории на 1 порцию (30г).'
    },
    {
        id: 'sup-2',
        name: 'Креатин моногидрат',
        category: 'Спортивное питание',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'creatine powder',
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        description: 'Увеличивает силовые показатели и выносливость. Принимать по 5г в день.'
    },
     {
        id: 'sup-3',
        name: 'BCAA 2:1:1',
        category: 'Спортивное питание',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'bcaa capsules',
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        description: 'Аминокислоты для предотвращения катаболизма во время тренировки.'
    }
];
