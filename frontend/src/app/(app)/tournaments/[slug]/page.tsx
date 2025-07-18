import { getTournamentBySlug } from "@/entities/tournament/api/get-tournament";
import { TournamentDetailsPage } from "@/views/tournament-details";
import { notFound } from "next/navigation";

export default async function TournamentDetailsRoute(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const tournament = await getTournamentBySlug(params.slug);

  if (!tournament) {
    notFound();
  }

  return <TournamentDetailsPage tournament={tournament} />;
}
