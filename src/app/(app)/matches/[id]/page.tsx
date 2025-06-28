
import { getMatchById } from "@/lib/mock-data/match-details";
import { notFound } from "next/navigation";
import MatchDetailsClient from "./client";

export default async function MatchDetailsPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return <MatchDetailsClient match={match} />;
}
