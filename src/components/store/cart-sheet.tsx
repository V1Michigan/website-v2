"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, Loader2, Package, Tag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartSheet() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      } else {
        console.error("No checkout URL returned");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#FAF7F2] border-l border-gray-200 p-0">
        <SheetHeader className="px-6 py-5 border-b border-gray-200">
          <SheetTitle className="font-instrument text-xl tracking-tight">
            Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <p className="text-sm text-gray-400 tracking-wide uppercase mb-6">
              Your cart is empty
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-sm text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-24 bg-[#f0ebe3] flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-instrument text-sm text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.size, item.color)
                        }
                        className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-instrument text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-gray-200 px-6 py-5 space-y-4 bg-white">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-instrument">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Hand Delivery
                  </span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                
                <p className="text-[10px] text-gray-400 italic">
                  Delivered by hand within ~1 month. Automated shipping coming soon!
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1">
                  <Tag className="h-3 w-3" />
                  <span>Have a promo code? Enter it at checkout.</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-2.5 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
