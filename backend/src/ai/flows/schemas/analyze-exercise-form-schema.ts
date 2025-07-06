import { z } from "zod";

export const AnalyzeExerciseFormInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A short video of a person performing an exercise, as a data URI that must include a MIME type (e.g., 'video/mp4') and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
  exerciseName: z
    .string()
    .describe(
      'The name of the exercise being performed (e.g., "Приседания со штангой").',
    ),
});
export type AnalyzeExerciseFormInput = z.infer<
  typeof AnalyzeExerciseFormInputSchema
>;

export const FormCorrectionSchema = z.object({
  part: z
    .string()
    .describe(
      'The body part or aspect of the form with an error (e.g., "Спина", "Глубина приседа").',
    ),
  correction: z
    .string()
    .describe("A specific instruction on how to correct the mistake."),
});

export const AnalyzeExerciseFormOutputSchema = z.object({
  overallAssessment: z
    .string()
    .describe("A brief, overall assessment of the exercise form."),
  corrections: z
    .array(FormCorrectionSchema)
    .describe("A list of specific mistakes found and how to correct them."),
  positivePoints: z
    .array(z.string())
    .describe("A list of things the person did correctly."),
});
export type AnalyzeExerciseFormOutput = z.infer<
  typeof AnalyzeExerciseFormOutputSchema
>;
