import { SportDetailsPage } from "@/views/sport-details";
import { getSportById } from "@/entities/sport/api/sports";
import { notFound } from "next/navigation";

export default async function SportDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const sport = await getSportById(params.id);
  if (!sport) {
    notFound();
  }
  return <SportDetailsPage sport={sport} />;
}
