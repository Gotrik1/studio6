import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { AppLayout } from "@/widgets/app-layout";
import { AppProviders } from "@/app/providers/app-providers";

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
    <AppProviders>
      <AppLayout user={user}>
        {children}
      </AppLayout>
    </AppProviders>
  );
}
