
import { MatchesListPage } from '@/views/matches-list';
import { fetchMatches } from "@/entities/match/api/get-matches";

export default async function MatchesPage() {
  const initialMatches = await fetchMatches();
  return <MatchesListPage initialMatches={initialMatches} />;
}
