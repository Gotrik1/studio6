"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/shared/context/cart-provider";

export function HeaderCart() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setIsCartOpen(true)}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-1 text-xs">
          {totalItems}
        </Badge>
      )}
      <span className="sr-only">Открыть корзину</span>
    </Button>
  );
}
