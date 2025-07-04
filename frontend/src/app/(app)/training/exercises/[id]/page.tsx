import { ExerciseDetailsPage } from "@/views/exercise-details";
import { exercisesList } from "@/shared/lib/mock-data/exercises";
import { notFound } from "next/navigation";

export default function ExerciseDetailsRoute({ params }: { params: { id: string } }) {
    const exercise = exercisesList.find(ex => ex.id === params.id);

    if (!exercise) {
        notFound();
    }
  
    return <ExerciseDetailsPage exercise={exercise} />;
}
