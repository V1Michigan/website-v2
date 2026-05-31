"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartButton() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="flex items-center gap-2 text-sm text-gray-900 hover:text-gray-600 transition-colors"
    >
      <ShoppingBag className="h-4 w-4" />
      <span className="tracking-wide">
        Cart{totalItems > 0 && ` (${totalItems})`}
      </span>
    </button>
  );
}
