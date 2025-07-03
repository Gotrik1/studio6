
import { getMatchById } from "@/entities/match/api/get-match";
import { notFound } from "next/navigation";
import { MatchDetailsPage } from "@/views/match-details";

export default async function MatchDetailsRoute({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return <MatchDetailsPage match={match} />;
}
