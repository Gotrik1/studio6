
import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { AppLayout } from "@/widgets/app-layout";
import { TeamProvider } from "@/app/providers/team-provider";
import { TrainingProvider } from "@/app/providers/training-provider";
import { AccentThemeProvider } from "@/app/providers/accent-theme-provider";
import { NutritionProvider } from "@/app/providers/nutrition-provider";

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
    <AccentThemeProvider>
        <TeamProvider>
        <TrainingProvider>
            <NutritionProvider>
                <AppLayout user={user}>
                    {children}
                </AppLayout>
            </NutritionProvider>
        </TrainingProvider>
        </TeamProvider>
    </AccentThemeProvider>
  );
}
