import { TournamentCrmDetailsPage } from "@/views/tournament-crm-details";

export default async function TournamentCrmDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <TournamentCrmDetailsPage tournamentId={params.id} />;
}
