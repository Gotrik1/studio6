import type { TrainingLogEntry } from '@/shared/lib/mock-data/training-log';
import { differenceInDays, isAfter, startOfMonth, parseISO } from 'date-fns';

const KEY_EXERCISES = ['Жим лежа', 'Приседания со штангой', 'Становая тяга'];

// Epley formula for 1RM estimation
const calculate1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
};

export const getTrainingAnalytics = (log: TrainingLogEntry[]) => {
    const completedWorkouts = log.filter(e => e.status === 'completed');
    
    // Personal Records
    const records: { [key: string]: number } = {};
    const exerciseCounts: { [key: string]: number } = {};

    completedWorkouts.forEach(entry => {
        entry.exercises.forEach(exercise => {
            // Count for favorite exercise
            exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;

            if (KEY_EXERCISES.includes(exercise.name)) {
                exercise.sets.forEach(set => {
                    if (set.isCompleted && set.loggedWeight && set.loggedReps && set.loggedReps > 0) {
                        const estimated1RM = calculate1RM(set.loggedWeight, set.loggedReps);
                        if (!records[exercise.name] || estimated1RM > records[exercise.name]) {
                            records[exercise.name] = estimated1RM;
                        }
                    }
                });
            }
        });
    });

    const personalRecords = KEY_EXERCISES.map(name => ({
        exercise: name,
        value: `${records[name] || 0} кг`
    }));

    // Other Metrics
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const monthlyVolume = completedWorkouts
        .filter(e => isAfter(parseISO(e.date), startOfThisMonth))
        .reduce((total, entry) => {
            return total + entry.exercises.reduce((entryTotal, ex) => {
                return entryTotal + ex.sets.reduce((setTotal, s) => {
                    return setTotal + ((s.loggedWeight || 0) * (s.loggedReps || 0));
                }, 0);
            }, 0);
        }, 0);

    const sortedWorkouts = completedWorkouts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let workoutStreak = 0;
    if (sortedWorkouts.length > 0) {
        workoutStreak = 1;
        for (let i = 0; i < sortedWorkouts.length - 1; i++) {
            const date1 = new Date(sortedWorkouts[i].date);
            const date2 = new Date(sortedWorkouts[i+1].date);
            if (differenceInDays(date1, date2) <= 2) { // Allow for a rest day
                workoutStreak++;
            } else {
                break;
            }
        }
    }
    
    const favoriteExercise = Object.keys(exerciseCounts).length > 0
        ? Object.keys(exerciseCounts).reduce((a, b) => exerciseCounts[a] > exerciseCounts[b] ? a : b)
        : 'Нет данных';


    const lastWorkout = sortedWorkouts[0]?.workoutName || 'Нет данных';

    const trainingMetrics = {
        monthlyVolume: `${Math.round(monthlyVolume / 1000)} т`,
        workoutStreak: `${workoutStreak} дней`,
        favoriteExercise: favoriteExercise,
        lastWorkout: lastWorkout,
    };
    
    const pullUpsRecord = completedWorkouts
        .flatMap(e => e.exercises)
        .filter(ex => ex.name === 'Подтягивания')
        .flatMap(ex => ex.sets)
        .filter(s => s.isCompleted && s.loggedReps)
        .reduce((maxReps, s) => Math.max(maxReps, s.loggedReps || 0), 0);

    if (pullUpsRecord > 0) {
        personalRecords.push({ exercise: 'Подтягивания', value: `${pullUpsRecord} раз` });
    }


    return { personalRecords, trainingMetrics };
};
