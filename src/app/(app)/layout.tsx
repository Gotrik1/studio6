
import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { AppLayout } from "@/widgets/app-layout";
import { TeamProvider } from "@/app/providers/team-provider";
import { TrainingProvider } from "@/app/providers/training-provider";

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
      <TrainingProvider>
        <AppLayout user={user}>
            {children}
        </AppLayout>
      </TrainingProvider>
    </TeamProvider>
  );
}
