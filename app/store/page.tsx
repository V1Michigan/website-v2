"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { PostHogPageView } from "@/components/posthog-provider";
import { ProductCard } from "@/components/store/product-card";
import { CartButton } from "@/components/store/cart-button";
import { merchProducts } from "@/data/merch";

type Category = "all" | "tshirt" | "hoodie" | "crewneck";

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredProducts =
    activeCategory === "all"
      ? merchProducts
      : merchProducts.filter((p) => p.category === activeCategory);

  const categories: { id: Category; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tshirt", label: "Tees" },
    { id: "hoodie", label: "Hoodies" },
    { id: "crewneck", label: "Crewnecks" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <PostHogPageView />
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-gray-900 pb-6">
          <div>
            <h1 className="font-instrument text-5xl md:text-6xl text-gray-900 tracking-tight">
              Merch
            </h1>
            <p className="text-gray-500 mt-2 text-sm tracking-wide uppercase">
              Build in style.
            </p>
          </div>
          <CartButton />
        </div>

        {/* Category Filter */}
        <div className="flex gap-6 mb-10 border-b border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pb-3 text-sm tracking-wide transition-colors relative ${
                activeCategory === cat.id
                  ? "text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm tracking-wide uppercase">
              No products in this category
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
