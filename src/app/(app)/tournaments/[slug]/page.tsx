
import { getTournamentBySlug } from "@/entities/tournament/api/get-tournament";
import TournamentDetailsPageClient from "./client";
import { notFound } from "next/navigation";

export default async function TournamentDetailsPage({ params }: { params: { slug: string } }) {
  const tournament = getTournamentBySlug(params.slug);
  
  if (!tournament) {
    notFound();
  }

  return <TournamentDetailsPageClient tournament={tournament} />;
}
