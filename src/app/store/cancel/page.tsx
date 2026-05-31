import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="h-10 w-10 text-orange-500" />
          </div>

          <h1 className="font-instrument text-3xl md:text-4xl text-gray-900 mb-4">
            Checkout Cancelled
          </h1>

          <p className="text-gray-600 mb-8">
            Your order was cancelled. No worries - your cart items are still
            saved. Come back whenever you&apos;re ready!
          </p>

          <div className="space-y-3">
            <Link href="/store">
              <Button className="w-full bg-accent hover:bg-orange-500 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Store
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

