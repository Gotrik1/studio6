

'use server';

import type { TrainingLogEntry, ExerciseLog, LoggedSet } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

// Local types to avoid direct dependency on backend schemas
type PrismaExercise = { id: string, name: string, [key: string]: any };
type PrismaSet = { id: string, plannedReps: string | null, plannedWeight: string | null, loggedReps: number | null, loggedWeight: number | null, rpe: number | null, isCompleted: boolean };
type RawLoggedExercise = { id: string, notes: string | null, isSupersetWithPrevious: boolean | null, exercise: PrismaExercise, sets: PrismaSet[] };
type RawTrainingLogEntry = { id: string, date: string, workoutName: string | null, status: 'COMPLETED' | 'PLANNED' | 'SKIPPED', mood: 'GREAT' | 'GOOD' | 'OK' | 'BAD' | null, notes: string | null, coachNotes: string | null, exercises: RawLoggedExercise[] };

function transformApiLogToFrontend(apiLog: RawTrainingLogEntry[]): TrainingLogEntry[] {
  return apiLog.map(log => ({
    id: log.id,
    date: log.date.toString(),
    workoutName: log.workoutName,
    status: log.status.toLowerCase() as 'completed' | 'planned' | 'skipped',
    notes: log.notes,
    coachNotes: log.coachNotes,
    mood: log.mood?.toLowerCase() as 'great' | 'good' | 'ok' | 'bad' | undefined,
    exercises: log.exercises.map((ex: RawLoggedExercise): ExerciseLog => ({
      id: ex.id,
      exercise: {
        id: ex.exercise.id,
        name: ex.exercise.name,
      },
      notes: ex.notes,
      isSupersetWithPrevious: ex.isSupersetWithPrevious,
      sets: ex.sets.map((set: PrismaSet): LoggedSet => ({
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
    const result = await fetchWithAuth<RawTrainingLogEntry[]>('/training/log');
    if (!result.success) {
        console.error("Failed to fetch training log:", result.error);
        return [];
    }
    return transformApiLogToFrontend(result.data as RawTrainingLogEntry[]);
}
