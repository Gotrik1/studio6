import { calculate1RM } from './calculate-1rm';
import type { TrainingLogEntry, PersonalRecord, RecordHistoryPoint, ExerciseSession } from '@/entities/training-program/model/types';

export type { PersonalRecord, RecordHistoryPoint, ExerciseSession };

// Helper function to get training metrics (for other widgets)
const getMetrics = (completedWorkouts: TrainingLogEntry[]) => {
    const totalWorkouts = completedWorkouts.length;
    const monthlyVolume = completedWorkouts.reduce((sum, entry) => {
        return sum + entry.exercises.reduce((exSum, ex) => {
            return exSum + ex.sets.reduce((setSum, set) => {
                return setSum + ((set.loggedWeight || 0) * (set.loggedReps || 0));
            }, 0);
        }, 0);
    }, 0).toLocaleString('ru-RU') + ' кг';

    // simple mock streak
    const workoutStreak = '5 дней'; 
    
    const exerciseCounts = new Map<string, number>();
    completedWorkouts.forEach(entry => {
        entry.exercises.forEach(ex => {
            exerciseCounts.set(ex.name, (exerciseCounts.get(ex.name) || 0) + 1);
        });
    });
    
    const sortedExercises = [...exerciseCounts.entries()].sort((a, b) => b[1] - a[1]);
    const favoriteExercise = sortedExercises.length > 0 ? sortedExercises[0][0] : 'Нет';

    const lastWorkout = completedWorkouts.length > 0 ? [...completedWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].workoutName : 'Нет';
    
    return { totalWorkouts, monthlyVolume, workoutStreak, favoriteExercise, lastWorkout };
};

const getVolumeByMuscleGroupData = () => {
    // Mock implementation for demo. In a real app this would use exercise data.
    return [
        { name: 'Грудь', volume: 4500 },
        { name: 'Спина', volume: 5200 },
        { name: 'Ноги', volume: 7800 },
        { name: 'Плечи', volume: 3200 },
        { name: 'Руки', volume: 2500 },
        { name: 'Пресс', volume: 1500 },
    ];
};

export const getTrainingAnalytics = (log: TrainingLogEntry[]) => {
    const completedWorkouts = log.filter(e => e.status === 'completed');
    
    const bestRecordsMap: { [key: string]: PersonalRecord } = {};
    const recordHistoryMap: { [key: string]: RecordHistoryPoint[] } = {};
    const fullHistoryMap: { [key: string]: ExerciseSession[] } = {};

    completedWorkouts.forEach(entry => {
        entry.exercises.forEach(exercise => {
             const session: ExerciseSession = {
                date: entry.date,
                workoutName: entry.workoutName,
                sets: []
            };

            let sessionHasExercise = false;

            exercise.sets.forEach(set => {
                if (set.isCompleted && set.loggedWeight && set.loggedReps && set.loggedReps > 0) {
                     sessionHasExercise = true;
                    session.sets.push({
                        reps: set.loggedReps,
                        weight: set.loggedWeight,
                        rpe: set.rpe
                    });

                    const estimated1RM = calculate1RM(set.loggedWeight, set.loggedReps);
                    
                    if (!recordHistoryMap[exercise.name]) {
                        recordHistoryMap[exercise.name] = [];
                    }
                    recordHistoryMap[exercise.name].push({ date: entry.date, e1RM: estimated1RM });

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
            
            if (sessionHasExercise) {
                if (!fullHistoryMap[exercise.name]) {
                    fullHistoryMap[exercise.name] = [];
                }
                fullHistoryMap[exercise.name].push(session);
            }
        });
    });
    
    const personalRecords = Object.values(bestRecordsMap).sort((a, b) => b.e1RM - a.e1RM);
    
    for (const key in recordHistoryMap) {
        recordHistoryMap[key].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
     for (const key in fullHistoryMap) {
        fullHistoryMap[key].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const trainingMetrics = getMetrics(completedWorkouts);
    const volumeByMuscleGroupData = getVolumeByMuscleGroupData();

    return { personalRecords, recordHistory: recordHistoryMap, fullExerciseHistory: fullHistoryMap, trainingMetrics, volumeByMuscleGroupData };
};
