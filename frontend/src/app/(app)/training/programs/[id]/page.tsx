import { TrainingProgramDetailsPage } from "@/views/training-program-details";
import { getProgramById } from "@/entities/training-program/api/get-program";
import { notFound } from "next/navigation";

export default async function ProgramDetailsRoute({ params }: { params: { id: string } }) {
  const program = await getProgramById(params.id);

  if (!program) {
      notFound();
  }

  return <TrainingProgramDetailsPage program={program} />;
}
