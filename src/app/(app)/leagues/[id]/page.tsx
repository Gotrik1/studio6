
import { LeagueDetailsPage } from '@/views/league-details';
import { leagues } from '@/shared/lib/mock-data/leagues';
import { notFound } from 'next/navigation';

export default function LeagueDetailsRoute({ params }: { params: { id: string } }) {
  const league = leagues.find(l => l.id === params.id);
  if (!league) {
    notFound();
  }
  return <LeagueDetailsPage league={league} />;
}
