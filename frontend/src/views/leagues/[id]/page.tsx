import { LeagueDetailsPage } from "@/views/league-details";
import { getLeagueById } from "@/entities/league/api/leagues";
import { notFound } from "next/navigation";

export default async function LeagueDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const league = await getLeagueById(params.id);
  if (!league) {
    notFound();
  }
  return <LeagueDetailsPage league={league} />;
}
