import { TrainingProgramDetailsPage } from "@/views/training-program-details";
import { getProgramById } from "@/entities/training-program/api/get-program";
import { notFound } from "next/navigation";

export default async function ProgramDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const program = await getProgramById(params.id);

  if (!program) {
    notFound();
  }

  return <TrainingProgramDetailsPage program={program} />;
}
