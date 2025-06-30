
import { getProgramById } from "@/entities/training-program/api/get-program";
import { TrainingProgramDetailsPage } from "@/views/training-program-details";
import { notFound } from "next/navigation";

export default function ProgramDetailsRoute({ params }: { params: { id: string } }) {
  const program = getProgramById(params.id);
  
  if (!program) {
    notFound();
  }

  return <TrainingProgramDetailsPage program={program} />;
}
