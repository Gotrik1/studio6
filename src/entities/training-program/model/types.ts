
export type ExerciseDetail = {
    name: string;
    sets: string;
    reps: string;
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
