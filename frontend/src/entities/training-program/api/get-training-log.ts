

'use server';

import type { TrainingLogEntry, ExerciseLog, LoggedSet } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import type { TrainingLog, LoggedExercise, LoggedSet as PrismaSet, Exercise as PrismaExercise } from '@prisma/client';

type RawLoggedSet = PrismaSet;

type RawExerciseLog = LoggedExercise & {
    exercise: PrismaExercise;
    sets: RawLoggedSet[];
};

type RawTrainingLogEntry = TrainingLog & {
    exercises: RawExerciseLog[];
};


function transformApiLogToFrontend(apiLog: RawTrainingLogEntry[]): TrainingLogEntry[] {
  return apiLog.map(log => ({
    id: log.id,
    date: log.date.toString(),
    workoutName: log.workoutName,
    status: log.status.toLowerCase() as 'completed' | 'planned' | 'skipped',
    notes: log.notes,
    coachNotes: log.coachNotes,
    mood: log.mood?.toLowerCase() as 'great' | 'good' | 'ok' | 'bad' | undefined,
    exercises: log.exercises.map((ex: RawExerciseLog): ExerciseLog => ({
      id: ex.id,
      exercise: {
        id: ex.exercise.id,
        name: ex.exercise.name,
      },
      notes: ex.notes,
      isSupersetWithPrevious: ex.isSupersetWithPrevious,
      sets: ex.sets.map((set: RawLoggedSet): LoggedSet => ({
        id: set.id,
        plannedReps: set.plannedReps,
        plannedWeight: set.plannedWeight,
        loggedReps: set.loggedReps,
        loggedWeight: set.loggedWeight,
        rpe: set.rpe,
        isCompleted: set.isCompleted,
      })),
    })),
  }));
}

export async function getTrainingLog(): Promise<TrainingLogEntry[]> {
    const result = await fetchWithAuth('/training/log');
    if (!result.success) {
        console.error("Failed to fetch training log:", result.error);
        return [];
    }
    return transformApiLogToFrontend(result.data as RawTrainingLogEntry[]);
}
