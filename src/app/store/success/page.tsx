"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="font-instrument text-3xl md:text-4xl text-gray-900 mb-4">
            Thank you for your order!
          </h1>

          <p className="text-gray-600 mb-4">
            Your order has been confirmed and we&apos;ll reach out soon to coordinate delivery.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-8 flex items-start gap-3">
            <Package className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-amber-800 font-medium">Hand Delivery</p>
              <p className="text-xs text-amber-700 mt-1">
                Your V1 merch will be delivered by hand within approximately 2-4 weeks. 
                Automated shipping coming soon!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/store">
              <Button className="w-full bg-gray-800 hover:bg-gray-700">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

