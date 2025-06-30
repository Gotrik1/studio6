
import type { TrainingLogEntry } from '@/shared/lib/mock-data/training-log';
import { differenceInDays, isAfter, startOfMonth, parseISO } from 'date-fns';
import { exercisesList } from '@/shared/lib/mock-data/exercises';

// Epley formula for 1RM estimation
const calculate1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
};

export type PersonalRecord = {
    exercise: string;
    e1RM: number;
    weight: number;
    reps: number;
    date: string;
};

// New type for history
export type RecordHistoryPoint = {
    date: string;
    e1RM: number;
};
export type RecordHistory = {
    [exerciseName: string]: RecordHistoryPoint[];
};


export const getTrainingAnalytics = (log: TrainingLogEntry[]) => {
    const completedWorkouts = log.filter(e => e.status === 'completed');
    
    // --- REVISED LOGIC FOR RECORDS AND HISTORY ---
    const bestRecordsMap: { [key: string]: PersonalRecord } = {};
    const fullRecordHistory: RecordHistory = {};
    const exerciseCounts: { [key: string]: number } = {};

    // Sort workouts by date ascending to build history correctly
    const sortedCompletedWorkouts = [...completedWorkouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedCompletedWorkouts.forEach(entry => {
        entry.exercises.forEach(exercise => {
            // Count for favorite exercise
            exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;

            if (!fullRecordHistory[exercise.name]) {
                fullRecordHistory[exercise.name] = [];
            }
            
            exercise.sets.forEach(set => {
                if (set.isCompleted && set.loggedWeight && set.loggedReps && set.loggedReps > 0) {
                    const estimated1RM = calculate1RM(set.loggedWeight, set.loggedReps);

                    // Update history
                    fullRecordHistory[exercise.name].push({
                        date: entry.date,
                        e1RM: estimated1RM,
                    });
                    
                    // Update best record map if this is a new PR
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


    // Volume by muscle group
    const volumeByMuscleGroup: { [key: string]: number } = {};

    completedWorkouts.forEach(entry => {
        entry.exercises.forEach(exercise => {
            const exerciseDetails = exercisesList.find(ex => ex.name === exercise.name);
            if (exerciseDetails) {
                const muscleGroup = exerciseDetails.muscleGroup;
                const exerciseVolume = exercise.sets.reduce((total, set) => {
                    return total + ((set.loggedWeight || 0) * (set.loggedReps || 0));
                }, 0);
                if (!volumeByMuscleGroup[muscleGroup]) {
                    volumeByMuscleGroup[muscleGroup] = 0;
                }
                volumeByMuscleGroup[muscleGroup] += exerciseVolume;
            }
        });
    });
    
    const volumeByMuscleGroupData = Object.entries(volumeByMuscleGroup)
        .map(([name, volume]) => ({ name, volume }))
        .filter(item => item.volume > 0);


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
        const today = new Date();
        const mostRecentWorkoutDate = new Date(sortedWorkouts[0].date);
        if (differenceInDays(today, mostRecentWorkoutDate) <= 1) { // Checks if the last workout was today or yesterday
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
        totalWorkouts: completedWorkouts.length,
    };

    return { personalRecords, trainingMetrics, volumeByMuscleGroupData, recordHistory: fullRecordHistory };
};
