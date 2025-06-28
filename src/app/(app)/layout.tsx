
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AppLayoutClient from "@/components/app-layout-client";
import type { User } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/auth");
  }

  return (
    <AppLayoutClient user={user}>
        {children}
    </AppLayoutClient>
  );
}
