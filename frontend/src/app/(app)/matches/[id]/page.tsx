import { getMatchById } from "@/entities/match/api/get-match";
import { notFound } from "next/navigation";
import { MatchDetailsPage } from "@/views/match-details";
import type { MatchDetails } from "@/entities/match/model/types";

export default async function MatchDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const match: MatchDetails | null = await getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return <MatchDetailsPage match={match} />;
}
