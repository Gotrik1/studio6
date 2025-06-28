
import { getTournamentBySlug } from "@/lib/mock-data/tournament-details";
import TournamentClientPage from "./client";
import { notFound } from "next/navigation";

export default function TournamentPage({ params }: { params: { slug: string } }) {
  // In a real app, you'd fetch this from a database or API based on the slug.
  // For now, we only have one tournament detail page.
  if (params.slug !== 'summer-kickoff') {
      notFound();
  }
  const tournament = getTournamentBySlug(params.slug);
  
  if (!tournament) {
    notFound();
  }

  return <TournamentClientPage tournament={tournament} />;
}
