'use client';

import { AccentThemeProvider } from "@/shared/context/accent-theme-provider";
import { TeamProvider } from "@/app/providers/team-provider";
import { TrainingProvider } from "@/app/providers/training-provider";
import { NutritionProvider } from "@/app/providers/nutrition-provider";
import { JoinRequestProvider } from "@/app/providers/join-request-provider";
import { PDEconomyProvider } from "@/app/providers/pd-provider";
import { LfgProvider } from "@/app/providers/lfg-provider";
import { TrainingProposalProvider } from "@/app/providers/training-proposal-provider";
import { MeasurementsProvider } from "@/app/providers/measurements-provider";
import { CartProvider } from "@/app/providers/cart-provider";
import { InventoryProvider } from "@/app/providers/inventory-provider";

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <InventoryProvider>
            <CartProvider>
                <AccentThemeProvider>
                    <TeamProvider>
                    <TrainingProvider>
                        <NutritionProvider>
                            <MeasurementsProvider>
                                <PDEconomyProvider>
                                    <LfgProvider>
                                        <JoinRequestProvider>
                                            <TrainingProposalProvider>
                                                {children}
                                            </TrainingProposalProvider>
                                        </JoinRequestProvider>
                                    </LfgProvider>
                                </PDEconomyProvider>
                            </MeasurementsProvider>
                        </NutritionProvider>
                    </TrainingProvider>
                    </TeamProvider>
                </AccentThemeProvider>
            </CartProvider>
        </InventoryProvider>
    );
}
