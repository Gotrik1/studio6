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
            { 
                name: 'Жим лежа', 
                sets: [
                    { plannedReps: '8', plannedWeight: '80 кг', loggedReps: 8, loggedWeight: 80, rpe: 7, isCompleted: true },
                    { plannedReps: '8', plannedWeight: '80 кг', loggedReps: 8, loggedWeight: 80, rpe: 8, isCompleted: true },
                    { plannedReps: '8', plannedWeight: '80 кг', loggedReps: 7, loggedWeight: 80, rpe: 9, isCompleted: true },
                    { plannedReps: '8', plannedWeight: '80 кг', loggedReps: 6, loggedWeight: 80, rpe: 10, isCompleted: true },
                ]
            },
            { 
                name: 'Жим гантелей на наклонной скамье', 
                sets: [
                    { plannedReps: '10', plannedWeight: '30 кг', loggedReps: 10, loggedWeight: 30, rpe: 8, isCompleted: true },
                    { plannedReps: '10', plannedWeight: '30 кг', loggedReps: 10, loggedWeight: 30, rpe: 8, isCompleted: true },
                    { plannedReps: '10', plannedWeight: '30 кг', loggedReps: 9, loggedWeight: 30, rpe: 9, isCompleted: true },
                ]
            },
            { 
                name: 'Французский жим', 
                sets: [
                    { plannedReps: '12', plannedWeight: '25 кг', loggedReps: 12, loggedWeight: 25, rpe: 7, isCompleted: true },
                    { plannedReps: '12', plannedWeight: '25 кг', loggedReps: 12, loggedWeight: 25, rpe: 7, isCompleted: true },
                    { plannedReps: '12', plannedWeight: '25 кг', loggedReps: 11, loggedWeight: 25, rpe: 8, isCompleted: true },
                ]
            },
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
            { 
                name: 'Становая тяга',
                sets: [
                     { plannedReps: '5', plannedWeight: '120 кг', loggedReps: 5, loggedWeight: 120, rpe: 8, isCompleted: true },
                     { plannedReps: '5', plannedWeight: '120 кг', loggedReps: 5, loggedWeight: 120, rpe: 8, isCompleted: true },
                     { plannedReps: '5', plannedWeight: '120 кг', loggedReps: 5, loggedWeight: 120, rpe: 9, isCompleted: true },
                     { plannedReps: '5', plannedWeight: '120 кг', loggedReps: 4, loggedWeight: 120, rpe: 10, isCompleted: true },
                     { plannedReps: '5', plannedWeight: '120 кг', loggedReps: 3, loggedWeight: 120, rpe: 10, isCompleted: true },
                ]
            },
            { 
                name: 'Подтягивания',
                sets: [
                    { plannedReps: 'max', plannedWeight: 'Собственный вес', loggedReps: 12, loggedWeight: 0, rpe: 8, isCompleted: true },
                    { plannedReps: 'max', plannedWeight: 'Собственный вес', loggedReps: 10, loggedWeight: 0, rpe: 9, isCompleted: true },
                    { plannedReps: 'max', plannedWeight: 'Собственный вес', loggedReps: 9, loggedWeight: 0, rpe: 9, isCompleted: true },
                    { plannedReps: 'max', plannedWeight: 'Собственный вес', loggedReps: 9, loggedWeight: 0, rpe: 10, isCompleted: true },
                ]
            },
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
            { 
                name: 'Приседания со штангой', 
                sets: [
                    { plannedReps: '5', plannedWeight: '100 кг', isCompleted: false },
                    { plannedReps: '5', plannedWeight: '100 кг', isCompleted: false },
                    { plannedReps: '5', plannedWeight: '100 кг', isCompleted: false },
                    { plannedReps: '5', plannedWeight: '100 кг', isCompleted: false },
                    { plannedReps: '5', plannedWeight: '100 кг', isCompleted: false },
                ] 
            },
            { 
                name: 'Жим ногами', 
                sets: [
                    { plannedReps: '12', plannedWeight: '150 кг', isCompleted: false },
                    { plannedReps: '12', plannedWeight: '150 кг', isCompleted: false },
                    { plannedReps: '12', plannedWeight: '150 кг', isCompleted: false },
                    { plannedReps: '12', plannedWeight: '150 кг', isCompleted: false },
                ] 
            },
            { 
                name: 'Армейский жим', 
                sets: [
                    { plannedReps: '8', plannedWeight: '40 кг', isCompleted: false },
                    { plannedReps: '8', plannedWeight: '40 кг', isCompleted: false },
                    { plannedReps: '8', plannedWeight: '40 кг', isCompleted: false },
                    { plannedReps: '8', plannedWeight: '40 кг', isCompleted: false },
                ] 
            },
        ],
    },
    {
        id: 'log-4',
        date: '2024-07-29',
        workoutName: 'День 3: Ноги и плечи (прошлая неделя)',
        status: 'skipped',
        exercises: [
             { 
                 name: 'Приседания со штангой',
                 sets: [
                     { plannedReps: '5', plannedWeight: '95 кг', isCompleted: false },
                 ]
             },
        ],
        notes: 'Пропустил из-за работы.'
    }
];
