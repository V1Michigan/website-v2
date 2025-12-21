import { CartProvider } from "@/components/store/cart-provider";
import { CartSheet } from "@/components/store/cart-sheet";

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

