import { getTeamBySlug } from "@/entities/team/api/get-team-by-slug";
import { TeamDetailsPage } from "@/views/team-details";
import { notFound } from "next/navigation";

export default async function TeamPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const team = await getTeamBySlug(params.slug);

  if (!team) {
    notFound();
  }

  return <TeamDetailsPage team={team} />;
}
