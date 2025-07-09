"use server";

import type { TrainingLogEntry, ExerciseLog, LoggedSet } from "../model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Prisma } from "@prisma/client";

// Local types to avoid direct dependency on backend schemas
const exerciseWithSets = Prisma.validator<Prisma.LoggedExerciseDefaultArgs>()({
  include: { exercise: true, sets: true },
});
type PrismaLoggedExercise = Prisma.LoggedExerciseGetPayload<
  typeof exerciseWithSets
>;

const logWithExercises = Prisma.validator<Prisma.TrainingLogDefaultArgs>()({
  include: { exercises: { include: { exercise: true, sets: true } } },
});
type RawTrainingLogEntry = Prisma.TrainingLogGetPayload<
  typeof logWithExercises
>;

function transformApiLogToFrontend(
  apiLog: RawTrainingLogEntry[],
): TrainingLogEntry[] {
  return apiLog.map((log) => ({
    id: log.id,
    date: log.date.toString(),
    workoutName: log.workoutName,
    status: log.status.toLowerCase() as "completed" | "planned" | "skipped",
    notes: log.notes,
    coachNotes: log.coachNotes,
    mood: log.mood?.toLowerCase() as
      | "great"
      | "good"
      | "ok"
      | "bad"
      | undefined,
    exercises: log.exercises.map(
      (ex: PrismaLoggedExercise): ExerciseLog => ({
        id: ex.id,
        exercise: {
          id: ex.exercise.id,
          name: ex.exercise.name,
        },
        notes: ex.notes,
        isSupersetWithPrevious: ex.isSupersetWithPrevious,
        sets: ex.sets.map(
          (set): LoggedSet => ({
            id: set.id,
            plannedReps: set.plannedReps,
            plannedWeight: set.plannedWeight,
            loggedReps: set.loggedReps,
            loggedWeight: set.loggedWeight,
            rpe: set.rpe,
            isCompleted: set.isCompleted,
          }),
        ),
      }),
    ),
  }));
}

export async function getTrainingLog(): Promise<TrainingLogEntry[]> {
  const result = await fetchWithAuth<RawTrainingLogEntry[]>("/training/log");
  if (!result.success) {
    console.error("Failed to fetch training log:", result.error);
    return [];
  }
  return transformApiLogToFrontend(result.data as RawTrainingLogEntry[]);
}
