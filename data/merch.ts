import { MerchProduct } from "@/types/merch";

export const merchProducts: MerchProduct[] = [
  {
    id: "v1-big-tech-tee",
    name: "Anti Big Tech Tee",
    description:
      "Oh, you work at a startup?",
    price: 3500, // $35.00
    image: "/merch/v1-big-tech-mockup-front.png",
    images: [
      "/merch/v1-big-tech-mockup-front.png",
      "/merch/v1-big-tech-mockup-back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "White", hex: "#ffffff" }],
    category: "tshirt",
  },
  {
    id: "v1-asymmetric-upside-tee",
    name: "Asymmetric Upside Tee",
    description:
      'A recipe to reap the upside.',
    price: 3500, // $35.00
    image: "/merch/v1-asymmetric-upside-front.png",
    images: [
      "/merch/v1-asymmetric-upside-front.png",
      "/merch/v1-asymmetric-upside-back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Natural", hex: "#d4cfc4" }],
    category: "tshirt",
  },
  {
    id: "v1-default-alive-tee",
    name: "Default Alive Tee",
    description:
      "Existing at default is better than not existing at all.",
    price: 3500, // $35.00
    image: "/merch/v1-default-alive-front.png",
    images: [
      "/merch/v1-default-alive-front.png",
      "/merch/v1-default-alive-back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Charcoal", hex: "#4a4a4a" }],
    category: "tshirt",
  },
  {
    id: "v1-asymmetric-upside-hoodie",
    name: "Asymmetric Upside Hoodie",
    description:
      "A recipe to reap the upside.",
    price: 6000, // $60.00
    image: "/merch/v1-asymmetric-upside-hoodie-front.png",
    images: [
      "/merch/v1-asymmetric-upside-hoodie-front.png",
      "/merch/v1-asymmetric-upside-hoodie-back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Natural", hex: "#d4cfc4" }],
    category: "hoodie",
  },
  {
    id: "v1-crewneck",
    name: "V1 Crewneck",
    description:
      "Classic embroidery.",
    price: 5000, // $50.00
    image: "/merch/v1-crewneck-black.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/merch/v1-crewneck-black.png" },
      { name: "Navy", hex: "#1e3a5f", image: "/merch/v1-crewneck-navy.png" },
    ],
    category: "crewneck",
  },
];
