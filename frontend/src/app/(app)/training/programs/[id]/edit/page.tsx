import { TrainingProgramEditPage } from "@/views/training-program-edit";

export default async function EditProgramRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <TrainingProgramEditPage programId={params.id} />;
}
