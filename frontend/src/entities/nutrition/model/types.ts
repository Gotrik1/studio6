export type FoodItem = {
    id: string;
    name: string;
    category: 'Продукты' | 'Спортивное питание';
    image: string | null;
    imageHint: string | null;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    description?: string | null;
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
