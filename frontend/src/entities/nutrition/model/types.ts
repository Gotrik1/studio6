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

export type FoodLogEntry = {
    id: string;
    meal: 'Завтрак' | 'Обед' | 'Ужин' | 'Перекус';
    name: string;
    grams: number;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
};
