import { getTournamentBySlug } from "@/entities/tournament/api/get-tournament";
import { TournamentDetailsPage } from "@/views/tournament-details";
import { notFound } from "next/navigation";

export default async function TournamentDetailsRoute({ params }: { params: { slug: string } }) {
  const tournament = getTournamentBySlug(params.slug);
  
  if (!tournament) {
    notFound();
  }

  return <TournamentDetailsPage tournament={tournament} />;
}
