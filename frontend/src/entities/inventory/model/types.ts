export type InventoryItem = {
  id: string;
  name: string;
  category: "Обувь" | "Одежда" | "Аксессуары" | "Периферия";
  type: string; // e.g., "Футбольные бутсы", "Игровая мышь"
  purchaseDate: string;
  lifespanMonths: number; // estimated lifespan in months
  image: string | null;
  imageHint: string | null;
};
