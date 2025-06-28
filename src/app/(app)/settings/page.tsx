import { getSession, type User } from "@/lib/session";
import { redirect } from "next/navigation";
import SettingsClient from "./client";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) redirect("/auth");

  return <SettingsClient user={user} />;
}
