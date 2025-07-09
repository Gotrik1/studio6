import { TournamentCrmDetailsPage } from "@/views/tournament-crm-details";

export default function TournamentCrmDetailsRoute({
  params,
}: {
  params: { id: string };
}) {
  return <TournamentCrmDetailsPage tournamentId={params.id} />;
}
