

import { LeagueDetailsPage } from '@/views/league-details';
import { notFound } from 'next/navigation';

export default async function LeagueDetailsRoute({ params }: { params: { id: string } }) {
  // This is a placeholder, as the backend doesn't serve leagues yet.
  // We'll return a 404 for now. In a real app, this would be an API call.
  // const league = await getLeagueById(params.id);
  // if (!league) {
    notFound();
  // }
  // return <LeagueDetailsPage league={league} />;
}
