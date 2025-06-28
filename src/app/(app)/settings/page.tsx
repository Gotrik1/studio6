import { getSession } from "@/lib/session";
import type { User } from "@/lib/types";
import { redirect } from "next/navigation";
import SettingsClient from "./client";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) redirect("/auth");

  // Augment user data to provide initial values to the form
  const userSettings = {
    ...user,
    location: "Москва",
    mainSport: "Valorant",
  };

  return <SettingsClient user={userSettings} />;
}
