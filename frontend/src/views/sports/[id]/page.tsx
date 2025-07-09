import { SportDetailsPage } from "@/views/sport-details";
import { getSportById } from "@/entities/sport/api/sports";
import { notFound } from "next/navigation";

export default async function SportDetailsRoute({
  params,
}: {
  params: { id: string };
}) {
  const sport = await getSportById(params.id);
  if (!sport) {
    notFound();
  }
  return <SportDetailsPage sport={sport} />;
}
