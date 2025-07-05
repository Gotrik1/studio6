

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

export type LoggedSet = {
    plannedReps: string;
    plannedWeight: string;
    loggedReps?: number;
    loggedWeight?: number;
    rpe?: number;
    isCompleted: boolean;
};

export type ExerciseLog = {
    name: string;
    notes?: string;
    sets: LoggedSet[];
    isSupersetWithPrevious?: boolean;
    technique?: string;
};

export type TrainingLogEntry = {
    id: string;
    date: string;
    workoutName: string;
    status: 'completed' | 'planned' | 'skipped';
    exercises: ExerciseLog[];
    mood?: 'great' | 'good' | 'ok' | 'bad';
    notes?: string;
    coachNotes?: string;
};
