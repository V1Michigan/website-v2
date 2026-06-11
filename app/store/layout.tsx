import React from "react"
import { CartProvider } from "@/components/store/cart-provider";
import { CartSheet } from "@/components/store/cart-sheet";

export const metadata = {
  title: "V1 Store - Official Merchandise",
  description: "Shop official V1 at Michigan merchandise including t-shirts, hoodies, and more. Support student entrepreneurship.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <CartSheet />
    </CartProvider>
  );
}

