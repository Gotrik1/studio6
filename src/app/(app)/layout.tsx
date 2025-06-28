
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AppLayoutClient from "@/components/app-layout-client";
import type { User } from "@/lib/types";
import { TeamProvider } from "@/context/team-provider";

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
    <TeamProvider>
      <AppLayoutClient user={user}>
          {children}
      </AppLayoutClient>
    </TeamProvider>
  );
}
