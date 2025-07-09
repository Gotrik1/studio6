import { redirect } from "next/navigation";

export default function PlayerScoutPage() {
  redirect("/search?tab=players");
}
