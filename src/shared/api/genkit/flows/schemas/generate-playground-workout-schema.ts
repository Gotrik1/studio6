import { z } from 'zod';

export const GeneratePlaygroundWorkoutInputSchema = z.object({
  equipment: z.array(z.string()).describe('A list of available equipment at the playground, e.g., ["Турники", "Брусья"].'),
});
export type GeneratePlaygroundWorkoutInput = z.infer<typeof GeneratePlaygroundWorkoutInputSchema>;

export const WorkoutExerciseSchema = z.object({
    name: z.string().describe('The name of the exercise.'),
    sets: z.string().describe('The number of sets, e.g., "3-4".'),
    reps: z.string().describe('The number of repetitions, e.g., "10-15" or "до отказа".'),
});

export const GeneratePlaygroundWorkoutOutputSchema = z.object({
  title: z.string().describe('A catchy name for the workout routine.'),
  description: z.string().describe('A brief description of the workout focus.'),
  exercises: z.array(WorkoutExerciseSchema).describe('A list of 3-5 exercises for the workout.'),
});
export type GeneratePlaygroundWorkoutOutput = z.infer<typeof GeneratePlaygroundWorkoutOutputSchema>;
