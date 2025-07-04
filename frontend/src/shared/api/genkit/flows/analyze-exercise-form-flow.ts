'use server';

// Define types locally to decouple from backend schemas.
export type FormCorrection = {
    part: string;
    correction: string;
};

export type AnalyzeExerciseFormInput = {
  videoDataUri: string;
  exerciseName: string;
};

export type AnalyzeExerciseFormOutput = {
  overallAssessment: string;
  corrections: FormCorrection[];
  positivePoints: string[];
};

export async function analyzeExerciseForm(input: AnalyzeExerciseFormInput): Promise<AnalyzeExerciseFormOutput> {
  const response = await fetch('/api/ai/analyze-exercise-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
