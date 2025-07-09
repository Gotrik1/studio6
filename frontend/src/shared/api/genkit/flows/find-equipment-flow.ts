"use server";

// Define types locally to decouple from backend schemas.
export type StoreItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
  category: string;
  isRealMoney: boolean;
};
export type FindEquipmentInput = string;
export type FindEquipmentOutput = {
  recommendations: StoreItem[];
};

export async function findEquipment(
  input: FindEquipmentInput,
): Promise<FindEquipmentOutput> {
  const response = await fetch("/api/ai/find-equipment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
