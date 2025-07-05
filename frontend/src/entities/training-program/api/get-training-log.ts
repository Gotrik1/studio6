'use server';

import type { TrainingLogEntry } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

function transformApiLogToFrontend(apiLog: any[]): TrainingLogEntry[] {
  return apiLog.map(log => ({
    id: log.id,
    date: log.date,
    workoutName: log.workoutName,
    status: log.status.toLowerCase(),
    notes: log.notes,
    coachNotes: log.coachNotes,
    mood: log.mood?.toLowerCase(),
    exercises: log.exercises.map((ex: any) => ({
      name: ex.exercise.name,
      notes: ex.notes,
      isSupersetWithPrevious: ex.isSupersetWithPrevious,
      sets: ex.sets.map((set: any) => ({
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
    return transformApiLogToFrontend(result.data);
}
