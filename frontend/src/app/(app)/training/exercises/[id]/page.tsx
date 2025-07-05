import { ExerciseDetailsPage } from "@/views/exercise-details";
import { getExerciseById } from "@/entities/exercise/api/get-exercises";
import { notFound } from "next/navigation";

export default async function ExerciseDetailsRoute({ params }: { params: { id: string } }) {
    const exercise = await getExerciseById(params.id);

    if (!exercise) {
        notFound();
    }
  
    return <ExerciseDetailsPage exercise={exercise} />;
}
