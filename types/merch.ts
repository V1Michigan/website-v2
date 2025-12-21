export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  images?: string[]; // multiple images for gallery view
  sizes: string[];
  colors: { name: string; hex: string; image?: string }[];
  category: "tshirt" | "crewneck" | "hoodie" | "hat";
}

export interface CartItem {
  product: MerchProduct;
  size: string;
  color: string;
  quantity: number;
}

