
import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { AppLayout } from "@/widgets/app-layout";
import { TeamProvider } from "@/app/providers/team-provider";
import { TrainingProvider } from "@/app/providers/training-provider";
import { AccentThemeProvider } from "@/app/providers/accent-theme-provider";
import { NutritionProvider } from "@/app/providers/nutrition-provider";
import { JoinRequestProvider } from "@/app/providers/join-request-provider";
import { PDEconomyProvider } from "@/app/providers/pd-provider";
import { LfgProvider } from "@/app/providers/lfg-provider";
import { TrainingProposalProvider } from "@/app/providers/training-proposal-provider";

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
                <PDEconomyProvider>
                    <LfgProvider>
                        <JoinRequestProvider>
                            <TrainingProposalProvider>
                                <AppLayout user={user}>
                                    {children}
                                </AppLayout>
                            </TrainingProposalProvider>
                        </JoinRequestProvider>
                    </LfgProvider>
                </PDEconomyProvider>
            </NutritionProvider>
        </TrainingProvider>
        </TeamProvider>
    </AccentThemeProvider>
  );
}
