import type React from "react";

export const metadata = {
  title: "North Star Experience - V1 at Michigan",
  description: "Explore the North Star experience, showcasing innovation and creativity at V1.",
};

export default function NorthStarLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh w-screen bg-black text-white font-instrument">{children}</div>;
}


