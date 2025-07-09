"use client";

import { AccentThemeProvider } from "@/shared/context/accent-theme-provider";
import { TrainingProvider } from "@/shared/context/training-provider";
import { NutritionProvider } from "@/shared/context/nutrition-provider";
import { PDEconomyProvider } from "@/shared/context/pd-provider";
import { LfgProvider } from "@/shared/context/lfg-provider";
import { TrainingProposalProvider } from "@/app/providers/training-proposal-provider";
import { MeasurementsProvider } from "@/shared/context/measurements-provider";
import { CartProvider } from "@/shared/context/cart-provider";
import { InventoryProvider } from "@/shared/context/inventory-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <CartProvider>
        <AccentThemeProvider>
          <TrainingProvider>
            <NutritionProvider>
              <MeasurementsProvider>
                <PDEconomyProvider>
                  <LfgProvider>
                    <TrainingProposalProvider>
                      {children}
                    </TrainingProposalProvider>
                  </LfgProvider>
                </PDEconomyProvider>
              </MeasurementsProvider>
            </NutritionProvider>
          </TrainingProvider>
        </AccentThemeProvider>
      </CartProvider>
    </InventoryProvider>
  );
}
