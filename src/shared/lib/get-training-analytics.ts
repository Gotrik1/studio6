
import type { TrainingLogEntry } from '@/shared/lib/mock-data/training-log';

export type PersonalRecord = {
    exercise: string;
    e1RM: number;
    weight: number;
    reps: number;
    date: string;
};

export const getTrainingAnalytics = (log: TrainingLogEntry[]) => {
    const completedWorkouts = log.filter(e => e.status === 'completed');
    
    const bestRecordsMap: { [key: string]: PersonalRecord } = {};

    completedWorkouts.forEach(entry => {
        entry.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                if (set.isCompleted && set.loggedWeight && set.loggedReps && set.loggedReps > 0) {
                    const estimated1RM = calculate1RM(set.loggedWeight, set.loggedReps);
                    if (!bestRecordsMap[exercise.name] || estimated1RM > bestRecordsMap[exercise.name].e1RM) {
                        bestRecordsMap[exercise.name] = {
                            exercise: exercise.name,
                            e1RM: estimated1RM,
                            weight: set.loggedWeight,
                            reps: set.loggedReps,
                            date: entry.date,
                        };
                    }
                }
            });
        });
    });
    
    const personalRecords = Object.values(bestRecordsMap).sort((a, b) => b.e1RM - a.e1RM);

    return { personalRecords };
};
