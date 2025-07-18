import { ExerciseDetailsPage } from "@/views/exercise-details";
import { getExerciseById } from "@/entities/exercise/api/get-exercises";
import { notFound } from "next/navigation";

export default async function ExerciseDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const exercise = await getExerciseById(params.id);

  if (!exercise) {
    notFound();
  }

  return <ExerciseDetailsPage exercise={exercise} />;
}
