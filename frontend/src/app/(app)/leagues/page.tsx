import { LeaguesListPage } from '@/views/leagues-list';
import { getLeagues } from '@/entities/league/api/leagues';

export default async function LeaguesRoute() {
  const leagues = await getLeagues();
  return <LeaguesListPage initialLeagues={leagues} />;
}
