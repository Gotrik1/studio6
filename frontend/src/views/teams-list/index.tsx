import { getTeams } from "@/entities/team/api/teams";
import { TeamsListClient } from "@/widgets/teams-list";

export async function TeamsListPage() {
  const teams = await getTeams();

  return <TeamsListClient initialTeams={teams} />;
}
