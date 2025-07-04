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

export const nutritionDiaryData: FoodLogEntry[] = [
    { id: '1', meal: 'Завтрак', name: 'Овсянка на молоке', grams: 250, calories: 220, protein: 10, fat: 5, carbs: 35 },
    { id: '2', meal: 'Завтрак', name: 'Яблоко', grams: 150, calories: 80, protein: 0, fat: 0, carbs: 20 },
    { id: '3', meal: 'Обед', name: 'Куриная грудка', grams: 150, calories: 248, protein: 46, fat: 5, carbs: 0 },
    { id: '4', meal: 'Обед', name: 'Гречка', grams: 200, calories: 264, protein: 9, fat: 2, carbs: 58 },
    { id: '5', meal: 'Обед', name: 'Овощной салат', grams: 200, calories: 100, protein: 2, fat: 8, carbs: 5 },
    { id: '6', meal: 'Ужин', name: 'Творог 5%', grams: 200, calories: 242, protein: 34, fat: 10, carbs: 4 },
    { id: '7', meal: 'Перекус', name: 'Протеиновый коктейль', grams: 30, calories: 120, protein: 24, fat: 1, carbs: 3 },
];
