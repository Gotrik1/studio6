import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AppLayoutClient from "@/components/app-layout-client";
import { TeamProvider } from "@/app/providers/team-provider";

export default async function ApplicationLayout({
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
