import { TrainingProgramEditPage } from "@/views/training-program-edit";

export default function EditProgramRoute({ params }: { params: { id: string } }) {
  return <TrainingProgramEditPage programId={params.id} />;
}
