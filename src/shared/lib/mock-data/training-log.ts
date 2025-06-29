export type ExerciseLog = {
    name: string;
    sets: string;
    weight: string;
    notes?: string;
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

export const trainingLogData: TrainingLogEntry[] = [
    {
        id: 'log-1',
        date: '2024-08-01',
        workoutName: 'День 1: Грудь и трицепс',
        status: 'completed',
        exercises: [
            { name: 'Жим лежа', sets: '4x8', weight: '80 кг' },
            { name: 'Жим гантелей на наклонной скамье', sets: '3x10', weight: '30 кг' },
            { name: 'Французский жим', sets: '3x12', weight: '25 кг' },
        ],
        mood: 'great',
        notes: 'Отличная тренировка, чувствую прогресс в жиме.',
        coachNotes: 'Молодец! Следи за техникой в последнем подходе жима лежа.'
    },
    {
        id: 'log-2',
        date: '2024-08-03',
        workoutName: 'День 2: Спина и бицепс',
        status: 'completed',
        exercises: [
            { name: 'Становая тяга', sets: '5x5', weight: '120 кг' },
            { name: 'Подтягивания', sets: '4x max', weight: 'Собственный вес' },
            { name: 'Тяга штанги в наклоне', sets: '4x8', weight: '60 кг' },
        ],
        mood: 'good',
        notes: 'Становая идет тяжело, но подтягивания улучшились.'
    },
    {
        id: 'log-3',
        date: '2024-08-05',
        workoutName: 'День 3: Ноги и плечи',
        status: 'planned',
        exercises: [
            { name: 'Приседания со штангой', sets: '5x5', weight: '100 кг' },
            { name: 'Жим ногами', sets: '4x12', weight: '150 кг' },
            { name: 'Армейский жим', sets: '4x8', weight: '40 кг' },
        ],
    },
    {
        id: 'log-4',
        date: '2024-07-29',
        workoutName: 'День 3: Ноги и плечи (прошлая неделя)',
        status: 'skipped',
        exercises: [
             { name: 'Приседания со штангой', sets: '5x5', weight: '95 кг' },
        ],
        notes: 'Пропустил из-за работы.'
    }
];
