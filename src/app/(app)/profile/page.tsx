import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfileClient from "./client";

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/auth');

  return <ProfileClient sessionUser={user} />;
}
