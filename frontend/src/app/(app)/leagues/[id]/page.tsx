import { LeagueDetailsPage } from '@/views/league-details';
import { getLeagueById } from '@/entities/league/api/leagues';
import { notFound } from 'next/navigation';

export default async function LeagueDetailsRoute({ params }: { params: { id: string } }) {
  const league = await getLeagueById(params.id);
  if (!league) {
    notFound();
  }
  return <LeagueDetailsPage league={league} />;
}
