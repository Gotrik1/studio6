
import { z } from 'zod';

export const GeneratePlaygroundWorkoutInputSchema = z.object({
  playgroundType: z.string().describe('The type of sport the playground is for (e.g., "Воркаут", "Футбол", "Фитнес-зал").'),
  equipment: z.array(z.string()).describe('A list of available equipment at the playground, e.g., ["Турники", "Брусья"].'),
});
export type GeneratePlaygroundWorkoutInput = z.infer<typeof GeneratePlaygroundWorkoutInputSchema>;

export const WorkoutExerciseSchema = z.object({
    name: z.string().describe('The name of the exercise or drill.'),
    sets: z.string().describe('The number of sets or a duration, e.g., "3-4" or "10 мин".'),
    reps: z.string().describe('The number of repetitions, e.g., "10-15", "до отказа", or a description of the drill.'),
});

export const GeneratePlaygroundWorkoutOutputSchema = z.object({
  title: z.string().describe('A catchy name for the workout or drill routine.'),
  description: z.string().describe('A brief description of the routine\'s focus.'),
  exercises: z.array(WorkoutExerciseSchema).describe('A list of 3-5 exercises or drills for the routine.'),
});
export type GeneratePlaygroundWorkoutOutput = z.infer<typeof GeneratePlaygroundWorkoutOutputSchema>;
