"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MerchProduct } from "@/types/merch";
import { useCart } from "./cart-provider";
import { Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: MerchProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = useMemo(() => {
    if (selectedColor.image) {
      return [selectedColor.image];
    }
    return product.images || [product.image];
  }, [selectedColor, product.images, product.image]);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor.name);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex] || images[0];

  return (
    <div className="group flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-[#f0ebe3] overflow-hidden mb-4">
        <Image
          key={`${selectedColor.name}-${currentImage}`}
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-md bg-gray-800 text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-md bg-gray-800 text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((image, idx) => (
                <button
                  type="button"
                  key={image}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 transition-all ${
                    idx === currentImageIndex
                      ? "bg-gray-900 w-4"
                      : "bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-instrument text-lg text-gray-900 leading-tight">
            {product.name}
          </h3>
          <span className="font-instrument text-lg text-gray-900 ml-4 flex-shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Size Selector */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  selectedSize === size
                    ? "bg-gray-800 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        {product.colors.length > 1 && (
          <div className="mb-4">
            <div className="flex gap-2 items-center">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color);
                    setCurrentImageIndex(0);
                  }}
                  className={`w-5 h-5 rounded-full transition-all ${
                    selectedColor.name === color.name
                      ? "ring-2 ring-offset-2 ring-gray-800"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">
                {selectedColor.name}
              </span>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`mt-auto w-full py-2 text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
