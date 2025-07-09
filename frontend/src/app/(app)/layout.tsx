import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { AppLayout } from "@/widgets/app-layout";
import { AppProviders } from "@/app/providers/app-providers";
import * as React from "react";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <AppProviders>
      <AppLayout user={session.user}>{children}</AppLayout>
    </AppProviders>
  );
}
