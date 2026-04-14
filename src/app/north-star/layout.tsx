import type React from "react";

export default function NorthStarLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh w-screen bg-black text-white font-instrument">{children}</div>;
}


