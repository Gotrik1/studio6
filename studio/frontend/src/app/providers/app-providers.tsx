'use client';

import { AccentThemeProvider } from "@/shared/context/accent-theme-provider";
import { TeamProvider } from "@/shared/context/team-provider";
import { TrainingProvider } from "@/shared/context/training-provider";
import { NutritionProvider } from "@/shared/context/nutrition-provider";
import { JoinRequestProvider } from "@/shared/context/join-request-provider";
import { PDEconomyProvider } from "@/shared/context/pd-provider";
import { LfgProvider } from "@/shared/context/lfg-provider";
import { TrainingProposalProvider } from "@/shared/context/training-proposal-provider";
import { MeasurementsProvider } from "@/shared/context/measurements-provider";
import { CartProvider } from "@/shared/context/cart-provider";
import { InventoryProvider } from "@/shared/context/inventory-provider";

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
