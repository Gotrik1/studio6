"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Promotion } from "../model/types";
import { revalidatePath } from "next/cache";

export type { Promotion };

export type CreatePromotionData = {
  name: string;
  description: string;
  prize: string;
  cost: string;
  imageDataUri: string;
  imageHint: string;
  endDate: string;
  sponsorId?: string;
};

export async function getPromotions(): Promise<Promotion[]> {
  const result = await fetchWithAuth<Promotion[]>("/promotions");
  if (!result.success || !result.data) {
    console.error("Failed to fetch promotions:", result.error);
    return [];
  }
  return result.data;
}

export async function createPromotion(data: CreatePromotionData) {
  const result = await fetchWithAuth("/promotions", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.success) {
    revalidatePath("/promotions");
  }

  return result;
}
